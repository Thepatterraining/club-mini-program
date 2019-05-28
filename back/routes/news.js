const router = require("koa-router")()

const news = require("../controller/news")

router.get('/news', news.getNews)

router.get('/new', news.getNew)

router.post('/new', news.create)

module.exports = router