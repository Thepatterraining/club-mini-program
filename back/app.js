const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const path = require("path")
const session = require('koa-session');

import dirReader from "./framework/dir_reader"

app.use(async (ctx, next) => {
  ctx.err = (obj) => {
    obj.data = !obj.data ? {} : obj.data
    ctx.status = 200;
    ctx.body = obj;
  }

  ctx.success = (data) => {
    const res = {}
    res.data = !data ? {} : data
    res.code = 0
    res.msg = "请求成功"
    ctx.body = res
  }

  await next()
})

// error handler
onerror(app)

// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  extension: 'pug'
}))

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// routes

dirReader(path.resolve(__dirname, './routes/')).map(filepath => {
   const route = require(filepath)
   app.use(route.routes(), route.allowedMethods())
})

// error-handling
app.on('error', (err, ctx) => {
  ctx.err({code: 12, msg: "出错了"})
  console.error('server error', err, ctx)
});

module.exports = app
