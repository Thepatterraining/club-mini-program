import { Op } from "sequelize";

import { ClubItems } from "../models/ClubItems";
import { Users } from "../models/Users";
import { Clubs } from "../models/Club";
import { updateLevel, getUser } from "./users";

export default class ClubItem {
  static async updateLevel(ctx) {
    let { id } = ctx.request.body;

    await ClubItems.update(
      {
        level: "COMMON"
      },
      {
        where: {
          id: id
        }
      }
    );

    ctx.success(true);
  }

  //获取所有社团
  static async getApply(ctx) {
    let { pageSize, pageIndex, club } = ctx.query;
    //计算offset
    let offset = parseInt(pageSize) * (parseInt(pageIndex) - 1);

    let where = {
      level: "APPLY"
    };

    if (club > 0) {
      where.club = club;
    }

    console.log(where);

    const items = await ClubItems.findAll({
      offset: +offset,
      limit: +pageSize,
      where: where,
      attributes: ["id", "user"],
      include: [
        {
          model: Users,
          attributes: ["name"],
          as: "user_info"
        },
        {
          model: Clubs,
          attributes: ["name"],
          as: "club_info"
        }
      ]
    });

    console.log(items);

    return ctx.success(items);
  }

  static async getUser(ctx) {
    let { pageSize, pageIndex, club, filters } = ctx.query;
    filters = filters ? JSON.parse(filters) : filters;
    let user_where = {};
    if (filters && filters.user) {
      user_where = {
        name: {
          [Op.like]: "%" + filters["user"] + "%"
        }
      };
    }
    console.log(typeof filters);
    console.log(user_where);
    //计算offset
    let offset = parseInt(pageSize) * (parseInt(pageIndex) - 1);

    const items = await ClubItems.findAll({
      offset: +offset,
      limit: +pageSize,
      where: {
        club: +club,
        level: {
          [Op.in]: ["COMMON", "MINISTER", "VICE_MINISTER"]
        }
      },
      attributes: ["id", "user", "level"],
      include: [
        {
          model: Users,
          attributes: ["name"],
          as: "user_info",
          where: user_where
        }
      ]
    });

    console.log(items);

    return ctx.success(items);
  }

  static async getJoin(ctx) {
    let { pageSize, pageIndex, user } = ctx.query;
    //计算offset
    let offset = parseInt(pageSize) * (parseInt(pageIndex) - 1);

    const items = await ClubItems.findAll({
      offset: +offset,
      limit: +pageSize,
      where: {
        user: +user
      },
      attributes: ["id", "club", "user"],
      include: [
        {
          model: Clubs,
          attributes: ["name"],
          as: "club_info"
        }
      ]
    });

    console.log(items);

    return ctx.success(items);
  }

  static async check(ctx) {
    let { id } = ctx.request.body;

    await ClubItems.update(
      {
        level: "COMMON"
      },
      {
        where: {
          id: id
        }
      }
    );

    ctx.success(true);
  }

  static async create(ctx) {
    let { user_id, club_id } = ctx.request.body;

    const item = await ClubItems.findOne({
      where: {
        user: user_id,
        club: club_id
      }
    });

    if (item) {
      return ctx.err({ code: 600001, msg: "已经申请加入或已经加入了" });
    }

    await ClubItems.create({
      user: user_id,
      club: club_id
    });

    ctx.success(true);
  }

  static async delete(ctx) {
    let { id } = ctx.request.body;

    await ClubItems.destroy({
      where: {
        id: id
      }
    });

    ctx.success(true);
  }

  static async setMinister(ctx) {
    return setMinisterFunc(ctx, "MINISTER");
  }

  static async setViceMinister(ctx) {
    return setMinisterFunc(ctx, "VICE_MINISTER");
  }
}

async function setMinisterFunc(ctx, level) {
  let { user_id, club_id } = ctx.request.body;
  console.log(user_id);
  //查询用户id 是否正确
  getUser(user_id).catch(err => {
    return ctx.err(err);
  });

  //查询这个人是否已经是部长
  const item = await ClubItems.findOne({
    where: {
      user: user_id,
      level: level
    }
  });

  if (item) {
    return ctx.err({
      code: 200003,
      msg: "这个人已经是部长或者副部长了，不能在设置了"
    });
  }

  //查询部长是不是已经有人了
  const clubItem = await ClubItems.findAll({
    where: {
      club: club_id,
      level: level
    },
    raw: true
  });

  if (clubItem) {
    if (level == "MINISTER" && clubItem.length == 1) {
      return ctx.err({ code: 200004, msg: "这个社团已经有部长了" });
    } else if (level == "VICE_MINISTER" && clubItem.length == 2) {
      return ctx.err({ code: 200004, msg: "这个社团已经有副部长了" });
    }
  }

  //设置成部长
  await ClubItems.update(
    {
      level: level
    },
    {
      where: {
        user: user_id,
        club: club_id
      }
    }
  );

  return ctx.success(true);
}

export async function getMinisterClub(user_id) {
  const item = await ClubItems.findOne({
    where: {
      user: user_id,
      level: {
        [Op.or]: ["MINISTER", "VICE_MINISTER"]
      }
    }
  });

  return item;
}

export async function getUserClub(user_id) {
  const item = await ClubItems.findOne({
    where: {
      user: user_id,
      level: "USER"
    }
  });

  return item;
}
