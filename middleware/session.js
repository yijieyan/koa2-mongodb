const commonError = require('../libs/error');
const security = require('../libs/security');
const redisService = require('../libs/redis');
module.exports = async function(ctx, next) {
    ctx.getSession = async function(__token) {
        try {
            if (__token)
                cookie = __token;
            let [secret, userId] = security.decipher(cookie).split(":");
            let session = await redisService.get(`${userId}`);
            if (session.secret !== secret) throw commonError.tokenValidationFailure();
            delete session.secret;
            session.cookie = cookie;
            return session;
        } catch (error) {
            return null;
        }
    };

    ctx.reSetSession = async function(value) {
        let [secret, userId] = security.decipher(cookie).split(":");
        let session = await redisService.get(`${userId}`);
        if (session.secret !== secret) throw commonError.tokenValidationFailure();
        Object.assign(session, value);
        return await redisService.set(`${userId}`, session);
    };

    ctx.setSession = async function(seems, token = cookie) {
        let [secret, userId] = security.decipher(token).split(":");
        seems.secret = secret;
        return await redisService.set(`${userId}`, seems);
    };

    ctx.sign = function(userId) {
        cookie = security.cipher(`${new Date().getTime()}:${userId}`);
        return cookie;
    };

    await next();
};