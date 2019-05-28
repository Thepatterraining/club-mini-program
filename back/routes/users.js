const router = require('koa-router')()

import User from '../controller/users'

router.post('/login', User.login)

router.post('/register', User.create)

router.get('/user', User.getUser)

router.get('/users', User.getUsers)

router.put('/user/:id', User.update)


module.exports = router
