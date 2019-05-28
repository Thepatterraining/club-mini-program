import moment from "moment";

import { Comments } from "../models/Comments";
import { Users } from "../models/Users";

export default class Comment {
  static async create(ctx) {
    let { content, pid, activity_id, user_id } = ctx.request.body;

    await Comments.create({
      content: content,
      activity_id: activity_id,
      user_id: user_id,
      pid: pid
    });

    return ctx.success(true);
  }

  static async getComments(ctx) {
    let { pageSize, pageIndex, activity_id } = ctx.query;
    //计算offset
    let offset = parseInt(pageSize) * (parseInt(pageIndex) - 1);

    const comments = await Comments.findAll({
      offset: +offset,
      limit: +pageSize,
      attributes: [
        "id",
        "content",
        "user_id",
        "pid",
        "created_at",
        "activity_id"
      ],
      include: [
        {
          model: Users,
          attributes: ["name", "avatar"]
        }
      ],
      where: {
        activity_id: activity_id
      }
    });

    return ctx.success(comments);
  }

  static async delete(ctx) {
    let { id, user_id } = ctx.request.body;

    if (!ctx.session.user) {
      return ctx.err({ code: 500001, msg: "请登录" });
    }

    await Comments.destroy({
      where: {
        id: id,
        user_id: user_id
      }
    });

    ctx.success(true);
  }
}
