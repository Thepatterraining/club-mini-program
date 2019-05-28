import { Clubs } from "../models/Club"
import {updateLevel, getUser} from "./users"
import {Op} from "sequelize"


export default class Club {

    //获取所有社团
    static async getClubs(ctx) {

        let {pageSize, pageIndex} = ctx.query
        //计算offset
        let offset = parseInt(pageSize) * (parseInt(pageIndex) - 1)
        console.log(offset)
        const clubs = await Clubs.findAll({
            offset: +offset,
            limit: +pageSize,
            attributes: ['id', 'name'],
        })

        console.log(clubs)
        
        return ctx.success(clubs)
    }

    //获取社团详情
    static async getClub(ctx) {
        let id = ctx.request.query.id
        const info = await Clubs.findOne({
            where: {
                id: id,
            }
        })

        ctx.success(info)
    }

    //更新社团信息
    static async update(ctx) {
        await Clubs.update(ctx.request.body,{
            where: {
                id: ctx.params.id
            }
        })

        ctx.success(true)
    }

    //创建社团
    static async create(ctx) {
        //查询是否创建
        const club = await Clubs.findOne({
            where: {
                name: ctx.request.body.name,
            }
        })
        if (club) {
            return ctx.err({code:"200001", msg:"社团已经被创建"})
        }

        await Clubs.create({
            name: ctx.request.body.name
        })

        return ctx.success(true)
    }

    static async delete(ctx) {
        //查询是否创建
        const club = await Clubs.findOne({
            where: {
                name: ctx.request.body.name,
            }
        })
        if (!club) {
            return ctx.err({code:"200002", msg:"删除失败"})
        }

        //把部长和副部长降级
        await updateLevel(club.minister, "COMMON")
        await updateLevel(club.vice_minister, "COMMON")
        await updateLevel(club.vice_minister_two, "COMMON")

        //所有人员退出社团

        await Clubs.destroy({
            where: {
                name: ctx.request.body.name,
            }
        })

        return ctx.success(true)
    }

    static async setMinister(ctx) {
        let {id, name} = ctx.request.body

        //查询用户id 是否正确
        getUser(id).catch(err => {
            return ctx.err(err)
        })

        //查询这个人是否已经是部长
        const club = await Clubs.findOne({
            where: {
                [Op.or]:[{
                    minister: id
                }, {
                    vice_minister: id
                }, {
                    vice_minister_two: id
                }]
            }
        })

        if (club) {
            return ctx.err({code: 200003, msg: "这个人已经是部长或者副部长了，不能在设置了"})
        }

        //查询部长是不是已经有人了
        const clubRaw = await Clubs.findOne({
            where: {
                name: name
            }
        })

        if (clubRaw.minister > 0) {
            return ctx.err({code: 200004, msg:"这个社团已经有部长了"})
        }

        //设置成部长
        await Clubs.update({
            minister: id
        }, {
            where: {
                name: name,
            }
        })

        return ctx.success(true)
    }

    static async setViceMinister(ctx) {
        let {id, name} = ctx.request.body

        //查询用户id 是否正确
        getUser(id).catch(err => {
            return ctx.err(err)
        })

        //查询这个人是否已经是部长
        const club = await Clubs.findOne({
            where: {
                [Op.or]:[{
                    minister: id
                }, {
                    vice_minister: id
                }, {
                    vice_minister_two: id
                }]
            }
        })

        if (club) {
            return ctx.err({code: 200003, msg: "这个人已经是部长或者副部长了，不能在设置了"})
        }

        //查询部长是不是已经有人了
        const clubRaw = await Clubs.findOne({
            where: {
                name: name
            }
        })

        if (clubRaw.vice_minister == 0) {
            //设置第一个部长
            await Clubs.update({
                vice_minister: id
            }, {
                where: {
                    name: name,
                }
            })
        } else if (clubRaw.vice_minister_two == 0) {
            //设置第二个部长
            await Clubs.update({
                vice_minister_two: id
            }, {
                where: {
                    name: name,
                }
            })
        } else {
            //副部长满了
            return ctx.err({code: 200004, msg:"这个社团副部长满了"})
        }

        
        return ctx.success(true)
    }
}