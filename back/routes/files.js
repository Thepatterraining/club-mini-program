const router = require("koa-router")()
import multer from "koa-multer"

import file from "../controller/files"


const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'public/uploads/')
    },
    filename: function(req, file, cb) {
        const fileFormat = (file.originalname).split(".");  //以点分割成数组，数组的最后一项就是后缀名
        cb(null,Date.now() + "." + fileFormat[fileFormat.length - 1]);
    }
})

const upload = multer({storage: storage})

router.post('/upload', upload.single('banner'), file.upload)

router.get('/banners', file.getBanners)

router.delete('/banner', file.delete)

router.post('/uploadClubAvatar', upload.single('club_avatar'), file.uploadClubAvatar)

router.post('/uploadActivity', upload.single('activity'), file.uploadActivity)

router.post('/uploadUserAvatar', upload.single('user_avatar'), file.uploadUser)

module.exports = router