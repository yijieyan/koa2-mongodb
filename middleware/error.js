let logger = require('../libs/logger')()
module.exports = async (ctx, next) => {
  try {
    logger.info({
      method: ctx.req.method,
      url: ctx.req.url,
      headers: ctx.req.headers
    })
    await next()
  } catch (err) {
    ctx.status = err.status || 200
    ctx.res.statusMessage = err.name || 'server error'
    console.log(err.stack)
    logger.error({
      method: ctx.req.method,
      url: ctx.req.url,
      headers: ctx.req.headers,
      code: err.code,
      message: err.name,
      stack: err.stack
    })
    console.log('1111111111111111')
    ctx.success(err.name, err.code)
  }
}
