import {Banners} from "../models/Banners"
import {Clubs} from "../models/Club"
import {ActivityImgs} from "../models/ActivityImgs"
import {Users} from "../models/Users"
import {upload_dir} from "../config/env.json"

export default class file {
    static async upload(ctx) {
        console.log(ctx.req.file)
        const {filename} = ctx.req.file
        const {user} = ctx.req.body
        //修改数据库
        await Banners.create({
            url: upload_dir + filename,
            author: user
        })

        ctx.success(upload_dir + filename)
    }

    static async uploadClubAvatar(ctx) {
        const {filename} = ctx.req.file
        const {club} = ctx.req.body
        await Clubs.update({
            avatar: upload_dir + filename,
        }, {
            where: {
                id: club
            }
        })

        ctx.success(upload_dir + filename)
    }

    static async uploadUser(ctx) {
        const {filename} = ctx.req.file
        const {user} = ctx.req.body
        await Users.update({
            avatar: upload_dir + filename,
        }, {
            where: {
                id: user
            }
        })

        ctx.success(upload_dir + filename)
    }

    static async uploadActivity(ctx) {
        const {filename} = ctx.req.file

        ctx.success(upload_dir + filename)
    }

    static async getBanners(ctx) {
        let {pageSize, pageIndex} = ctx.query
        //计算offset
        let offset = parseInt(pageSize) * (parseInt(pageIndex) - 1)

        const banners = await Banners.findAll({
            offset: +offset,
            limit: +pageSize,
            attributes: ['id', 'url', 'author', 'created_at'],
        })
        
        ctx.success(banners)
    }

    static async delete(ctx) {
        const {url} = ctx.request.body
        await Banners.destroy({
            where: {
                url: url
            }
        })

        ctx.success(true)
    }
}