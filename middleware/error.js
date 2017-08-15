module.exports = async function (ctx, next) {
    try {
        await next();
    } catch (err) {
        ctx.status = err.status || 200;
        ctx.res.statusMessage = err.name || 'server error';
        console.log(err.stack);
        ctx.error(err.code,err.name);
    }
};