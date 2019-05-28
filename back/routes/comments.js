const router = require("koa-router")()

import Comment  from "../controller/comments"

router.post('/comment', Comment.create)

router.get('/comments', Comment.getComments)

router.delete('/comment', Comment.delete)

module.exports = router