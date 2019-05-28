const router = require("koa-router")()

import activities  from "../controller/activities"

router.post('/activity', activities.create)

router.get('/activities', activities.getActivities)

router.get('/activity', activities.getActivity)

router.post('/check_activity', activities.check)

router.put('/activity/:id', activities.update)

router.get('/activity_imgs/:activity_id', activities.getImgs)

router.post('/push_activity', activities.push)

router.delete('/activity', activities.delete)

router.post('/like_activity', activities.like)

module.exports = router