const Koa = require('koa')
const path = require('path')
const app = new Koa()
const json = require('koa-json')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const config = require('./config')
require('./libs/db')
const error = require('./middleware/error')
const auth = require('./middleware/auth')

const common = require('./routes/common')
const users = require('./routes/users')

process.env.dataDir = __dirname

// middlewares
app.use(bodyparser({
  enableTypes: ['json', 'form', 'text']
}))
app.use(json())
app.use(logger())

app.use(require('koa-static')(path.join(__dirname, 'public')))

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})
app.use(auth)
app.use(error)

// routes
app.use(common.routes(), common.allowedMethods())
app.use(users.routes(), users.allowedMethods())

app.listen(`${config.port}`)
console.log(`listen ${config.port} ...`)

module.exports = app
