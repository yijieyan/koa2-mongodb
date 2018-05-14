const security = require('../libs/security')
const commonError = require('../libs/error')
const redisService = require('../libs/redis')
module.exports = async function (ctx, next) {
  ctx.success = function (data, code = 0) {
    ctx.body = {
      code,
      data
    }
  }

  ctx.getSession = async function (__token) {
    try {
      let token = __token
      let [secret, userId] = security.decipher(token).split(':')
      let session = await redisService.get(`${userId}`)
      if (!session || session.secret !== secret) throw new commonError.TokenValidationFailure()
      delete session.secret
      return session
    } catch (error) {
      throw new commonError.TokenValidationFailure()
    }
  }

  ctx.reSetSession = async function (value, token = ctx.req.headers.token) {
    let [secret, userId] = security.decipher(token).split(':')
    let session = await redisService.get(`${userId}`)
    if (session.secret !== secret) throw new commonError.TokenValidationFailure()
    Object.assign(session, value)
    let ret = await redisService.set(`${userId}`, session)
    return ret
  }

  ctx.setSession = async function (seems, token) {
    let [secret, userId] = security.decipher(token).split(':')
    seems._doc.secret = secret
    let ret = await redisService.set(`${userId}`, seems)
    return ret
  }

  ctx.delSession = async function (token) {
    let [userId] = security.decipher(token).split(':')
    let ret = await redisService.del(`${userId}`)
    return ret
  }

  ctx.sign = function (userId) {
    let cookie = security.cipher(`${new Date().getTime()}:${userId}`)
    return cookie
  }

  if (ctx.url === '/favicon.ico') return

  if (!ctx.path.startsWith('/common')) {
    let token = ctx.req.headers.token
    let user = await ctx.getSession(token)
    if (!token) {
      throw new commonError.TokenValidationFailure()
    }
    ctx.userId = user.userId
  } else {
    if (ctx.req.headers.token) {
      let token = ctx.req.headers.token
      let user = await ctx.getSession(token)
      if (!token) {
        throw new commonError.TokenValidationFailure()
      }
      ctx.userId = user.userId
    }
  }
  await next()
}
