import crypto from "crypto";
import { Op } from "sequelize";

import { Users } from "../models/Users";
import { getMinisterClub, getUserClub } from "./clubItems";

import env from "../config/env";

export default class User {
  static async getUser(ctx) {
    let { name } = ctx.request.query;
    console.log(name);
    const user = await Users.findOne({
      where: {
        name: {
          [Op.like]: `%${name}%`
        }
      }
    });
    if (!user) {
      return ctx.err({ code: 100004, msg: "用户不存在" });
    }
    return ctx.success(user);
  }

  static async getUsers(ctx) {
    let { pageIndex, pageSize, filter } = ctx.request.query;

    filter = JSON.parse(filter);
    let where = {};

    if (filter && filter.name) {
      console.log(typeof filter);
      console.log(filter["name"]);
      where = {
        name: {
          [Op.like]: "%" + filter.name + "%"
        }
      };
    }

    //计算offset
    let offset = parseInt(pageSize) * (parseInt(pageIndex) - 1);
    const userList = await Users.findAll({
      offset: +offset,
      limit: +pageSize,
      attributes: ["id", "name", "created_at"],
      where: where
    }).map(t => {
      console.log(t);
      t.user_info = {};
      return (t.user_info.name = t.name);
    });
    console.log(filter);
    console.log(where);
    return ctx.success(userList);
  }

  static async update(ctx) {
    let { id } = ctx.params;
    let { name } = ctx.request.body;

    await Users.update(
      {
        name: name
      },
      {
        where: {
          id: id
        }
      }
    );

    ctx.success(true);
  }

  /**
   * 登录
   * @param {string} mobile 手机号
   * @param {string} pwd 密码
   */
  static async login(ctx) {
    console.log(ctx.request.body);
    let { name, pwd } = ctx.request.body;
    const user = await Users.findOne({
      where: {
        name: name
      },
      attributes: ["pwd", "id", "avatar", "name", "level"]
    });
    if (!user) {
      return ctx.err({ code: 100001, msg: "用户未注册" });
    }

    // 判断密码
    if (!checkPwd(user.pwd, pwd)) {
      return ctx.err({ code: 100002, msg: "密码错误" });
    }

    //查询是不是社团部长
    let level = "USER";
    let club = 0;
    if (user.level != "ADMIN") {
      const item = await getMinisterClub(user.id);
      if (item) {
        //是社团的部长
        level = item.level;
        club = item.club;
      } else {
        //查询是不是社团普通成员
        const clubItem = await getUserClub(user.id);
        if (clubItem) {
          //是普通成员
          club = clubItem.club;
        }
      }
    } else {
      level = user.level;
    }

    const res = {
      name: user.name,
      avatar: user.avatar,
      id: user.id,
      level: level,
      club: club
    };

    ctx.success(res);
  }

  /**
   * 创建管理用户
   * @param {string} name   姓名
   * @param {string} mobile 手机
   * @param {string} pwd 密码
   */
  static async create(ctx) {
    let { name, pwd } = ctx.request.body;
    //查询是否已经存在
    const user = await Users.findOne({
      where: {
        name: name.toString()
      }
    });
    if (user) {
      return ctx.err({ code: 100003, msg: "用户已经注册" });
    }

    pwd = encrypt(pwd);

    let avatar = env.default_avatar;
    const userInfo = await Users.create({
      name: name,
      pwd: pwd,
      level: "COMMON",
      avatar: avatar
    });
    ctx.success(userInfo.id);
  }
}

/**
 * 对密码加密
 * @param {string} pwd  密码
 */
function encrypt(pwd) {
  let hash = crypto.createHash("sha256");
  pwd = hash.update(pwd + "pwd").digest("hex");
  return pwd;
}

/**
 * 检查登陆密码是否一致
 * @param {string} pwd 原密码
 * @param {string} new_pwd 新密码
 */
export function checkPwd(pwd, new_pwd) {
  let newPwd = encrypt(new_pwd);
  if (pwd === newPwd) {
    return true;
  }
  return false;
}

/**
 * 忘记密码
 * @param {string} mobile 手机号
 * @param {string} pwd  密码
 */
export async function forget(mobile, pwd) {
  //查询手机是否已经存在
  const user = await Admins.findOne({
    where: {
      mobile: mobile.toString()
    }
  });
  if (!user) {
    throw new Error("用户不存在");
  }

  pwd = encrypt(pwd);
  await Admins.update(
    {
      pwd: pwd
    },
    {
      where: {
        mobile: mobile.toString()
      }
    }
  );
}

/**
 * 修改密码
 * @param {int} user_id  用户id
 * @param {string} pwd  原密码
 * @param {string} new_pwd 新密码
 */
export async function updatePwd(user_id, pwd, new_pwd) {
  //查询用户是否已经存在
  const user = await Admins.findOne({
    where: {
      id: user_id
    }
  });
  if (!user) {
    throw new Error("用户不存在");
  }

  //如果原密码不等于原密码就报错
  if (checkPwd(user.pwd, pwd) === false) {
    throw new Error("原密码错误");
  }

  //判断新密码不能和原密码一样
  if (checkPwd(user.pwd, new_pwd)) {
    throw new Error("新密码不能和原密码一样");
  }

  new_pwd = encrypt(new_pwd);
  await Admins.update(
    {
      pwd: new_pwd
    },
    {
      where: {
        id: user_id
      }
    }
  );
  return true;
}

/**
 * 查询用户信息
 * @param {int} user_id 用户id
 */
export async function getUser(user_id) {
  const user = await Users.findOne({
    where: {
      id: user_id
    }
  });
  if (!user) {
    throw new Error("用户不存在");
  }
  return user;
}

/**
 * 查询用户列表
 * @param {int} pageIndex 页码
 * @param {int} pageSize  每页数量
 */
export async function getAdmins(pageIndex, pageSize) {
  //计算offset
  let offset = parseInt(pageSize) * (parseInt(pageIndex) - 1);
  const userList = await Admins.findAll({
    offset: +offset,
    limit: +pageSize,
    attributes: ["id", "name", "mobile", "created_at", "deleted_at"],
    paranoid: false
  });
  return userList;
}

/**
 * 删除用户
 * @param {int} id
 */
export async function deleteAdmin(id) {
  await Admins.destroy({
    where: {
      id: id
    }
  });
  return true;
}

/**
 * 恢复用户
 * @param {int} id
 */
export async function renewAdmin(id) {
  //恢复软删除的数据
  await Admins.restore({
    where: {
      id: id
    }
  });
  return true;
}

export async function updateLevel(id, level) {
  await Users.update(
    {
      level: level
    },
    {
      where: {
        id: id
      }
    }
  );
}
