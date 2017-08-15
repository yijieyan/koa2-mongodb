module.exports = async function(ctx, next) {
    ctx.success =  function(data= '') {
        if(Object.prototype.toString.call(data).slice(8,-1) == 'Object') {
            data = JSON.stringify(data);
        }
        ctx.body = {code: 200 , data: `${data}`, message: '操作成功'};
    };
    ctx.error= function (code= 500, msg= '') {
        if(Object.prototype.toString.call(msg).slice(8,-1) == 'Object') {
            msg = JSON.stringify(msg);
        }
        ctx.body = {code, error: `${msg}`, message: '操作失败'};
    };
    await next();
};
