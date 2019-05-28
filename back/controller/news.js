import { News } from "../models/News"


class New {

    //获取所有文章
    static async getNews(ctx) {

        let {pageSize, pageIndex} = ctx.query
        // let pageIndex = ctx.query.pageIndex
        //计算offset
        let offset = parseInt(pageSize) * (parseInt(pageIndex) - 1)

        const news = await News.findAll({
            offset: +offset,
            limit: +pageSize,
            attributes: ['id', 'title', 'content', 'created_at'],
        })
        
        ctx.success(news)
    }

    //获取文章详情
    static async getNew(ctx) {
        let id = ctx.query.id
        const info = await News.findOne({
            where: {
                id: id,
            }
        })

        ctx.success(info)
    }

    //创建文章
    static async create(ctx) {
        console.log(ctx.request.body)

        let {title, content, author} = ctx.request.body

        console.log(author)

        //查询有没有创建这个
        const info = await News.findOne({
            where: {
                title: title,
            }
        })
        if (info) {
            return ctx.err({code: 300001, msg: "通知标题已经存在"})
        }

        await News.create({
            title: title,
            content: content,
            author: author
        })

        return ctx.success(true)
    }
}


module.exports = New