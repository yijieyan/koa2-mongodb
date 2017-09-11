const security = require('../libs/security');
const commonError = require('../libs/error');
module.exports = async function(ctx, next){
    if(ctx.path.startsWith('/public')) {
        console.log(ctx.path);
    }else {
        let token = ctx.req.headers.token;
        let user= ctx.getSession();
        if(!token) {
            throw new commonError.tokenValidationFailure();
        }
        ctx.userId = user.userId;
    }
    await next();
};
