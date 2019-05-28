import { Op, col } from "sequelize";
import moment from "moment";

import { Activities } from "../models/Activities";
import { ActivityImgs } from "../models/ActivityImgs";
import { Users } from "../models/Users";
import { Clubs } from "../models/Club";
import { Likes } from "../models/likes";
import { ClubItems } from "../models/ClubItems";

export default class Activity {
  static async getImgs(ctx) {
    const imgs = await ActivityImgs.findAll({
      where: {
        activity_id: ctx.params.activity_id
      }
    }).map(res => {
      return res.url;
    });

    return ctx.success(imgs);
  }

  //创建活动
  static async create(ctx) {
    //查询活动是否创建
    const activity = await Activities.findOne({
      where: {
        name: ctx.request.body.name
      }
    });
    if (activity) {
      return ctx.err({ code: 400003, msg: "活动已经创建" });
    }

    let user_id = ctx.request.body.user_id;

    //查询是哪个社团的干部
    const item = await ClubItems.findOne({
      where: {
        user: user_id,
        level: {
          [Op.in]: ["MINISTER", "VICE_MINISTER"]
        }
      }
    });

    ctx.request.body.club_id = item.club;

    console.log(ctx.request.body);

    //创建活动
    const activityInfo = await Activities.create(ctx.request.body);

    console.log(ctx.request.body.imgs);
    //添加图片
    for (let url of ctx.request.body.imgs) {
      ActivityImgs.create({
        activity_id: activityInfo.id,
        url: url
      });
    }

    ctx.success(true);
  }

  static async update(ctx) {
    //查询活动是否创建
    let { id } = ctx.params;
    const activity = await Activities.findOne({
      where: {
        id: id
      }
    });
    if (!activity) {
      return ctx.err({ code: 400001, msg: "活动不存在" });
    }

    await Activities.update(ctx.request.body, {
      where: {
        id: id
      }
    });

    //把图片更新到这个活动下
    for (let url of ctx.request.body.imgs) {
      //先查有没有
      const activityImg = await ActivityImgs.findOne({
        where: {
          url: url,
          activity_id: id
        }
      });
      if (!activityImg) {
        ActivityImgs.create({
          url: url,
          activity_id: id
        });
      }
    }

    return ctx.success(true);
  }

  static async getActivities(ctx) {
    let { pageSize, pageIndex, user_id, filter } = ctx.query;

    filter = filter ? JSON.parse(filter) : filter;
    console.log(filter);
    let where = {};
    if (filter && filter.user_id) {
      //查询这个用户有哪些社团
      const clubItems = await ClubItems.findAll({
        where: {
          user: filter.user_id,
          level: {
            [Op.in]: ["COMMON", "VICE_MINISTER", "MINISTER"]
          }
        },
        attributes: ["club"],
        raw: true
      });

      console.log(clubItems);

      let club_ids = [];
      clubItems.map(t => {
        club_ids.push(t.club);
      });

      where = {
        club_id: {
          [Op.in]: club_ids
        }
      };
      console.log(where);
    }

    if (filter && filter.push) {
      where.push = filter.push;
    }

    //计算offset
    let offset = parseInt(pageSize) * (parseInt(pageIndex) - 1);

    const activities = await Activities.findAll({
      offset: +offset,
      limit: +pageSize,
      where: where,
      attributes: [
        "id",
        "name",
        "approval",
        "push",
        "startDate",
        "endDate",
        "status",
        "content",
        "created_at",
        "user_id",
        "club_id"
      ],
      include: [
        {
          model: Users,
          attributes: ["name", "avatar"]
        },
        {
          model: Clubs,
          attributes: ["name"]
        },
        {
          model: ActivityImgs,
          attributes: ["url"]
        },
        {
          model: Likes,
          where: {
            activity_id: col("activities.id"),
            user_id: user_id ? user_id : 0
          },
          required: false,
          as: "isLike",
          attributes: ["id"],
          raw: true
        }
      ]
    });

    console.log(activities);

    return ctx.success(activities);
  }

  static async check(ctx) {
    let { id } = ctx.request.body;

    const activity = await Activities.findOne({
      where: {
        id: id
      }
    });

    if (!activity) {
      return ctx.err({ code: 400001, msg: "活动不存在" });
    }

    if (activity.approval) {
      return ctx.err({ code: 400002, msg: "活动已经审核" });
    }

    await Activities.update(
      {
        approval: true
      },
      {
        where: {
          id: id
        }
      }
    );

    ctx.success(true);
  }

  static async getActivity(ctx) {
    let { id, user_id } = ctx.request.query;
    const activity = await Activities.findOne({
      where: {
        id: id
      },
      attributes: [
        "id",
        "name",
        "approval",
        "push",
        "startDate",
        "endDate",
        "status",
        "content",
        "created_at",
        "user_id",
        "club_id",
        "place",
        "number",
        "amount",
        "like"
      ],
      include: [
        {
          model: Users,
          attributes: ["name", "avatar"]
        },
        {
          model: Clubs,
          attributes: ["name"]
        },
        {
          model: ActivityImgs,
          attributes: ["url"]
        },
        {
          model: Likes,
          where: {
            activity_id: col("activities.id"),
            user_id: user_id
          },
          required: false,
          as: "isLike",
          attributes: ["id"],
          raw: true
        }
      ]
    });

    if (!activity) {
      return ctx.err({ code: 400001, msg: "活动不存在" });
    }

    return ctx.success(activity);
  }

  static async push(ctx) {
    let { id } = ctx.request.body;
    console.log(id);

    const activity = await Activities.findOne({
      where: {
        id: id
      }
    });

    if (!activity) {
      return ctx.err({ code: 400001, msg: "活动不存在" });
    }

    //判断状态
    if (!activity.approval) {
      return ctx.err({ code: 400004, msg: "活动未审核" });
    }

    if (activity.push) {
      return ctx.err({ code: 400005, msg: "活动已发布" });
    }

    await Activities.update(
      {
        push: true
      },
      {
        where: {
          id: id
        }
      }
    );

    ctx.success(true);
  }

  static async delete(ctx) {
    let { id } = ctx.request.body;

    await Activities.destroy({
      where: {
        id: id
      }
    });

    ctx.success(true);
  }

  static async like(ctx) {
    let { activity_id, user_id } = ctx.request.body;

    //查询有没有点赞
    const like = await Likes.findOne({
      where: {
        activity_id: activity_id,
        user_id: user_id
      }
    });

    const activity = await Activities.findOne({
      where: {
        id: activity_id
      },
      attributes: ["like"]
    });

    if (!activity) {
      return ctx.err({ code: 400001, msg: "活动不存在" });
    }

    if (like) {
      //取消点赞
      await Activities.update(
        {
          like: --activity.like
        },
        {
          where: {
            id: activity_id
          }
        }
      );

      await Likes.destroy({
        where: {
          activity_id: activity_id,
          user_id: user_id
        }
      });

      return ctx.success(false);
    }

    await Activities.update(
      {
        like: ++activity.like
      },
      {
        where: {
          id: activity_id
        }
      }
    );

    await Likes.create({
      activity_id: activity_id,
      user_id: user_id
    });

    ctx.success(true);
  }
}
