const Koa = require('koa');
const app = new Koa();
const json = require('koa-json');
const bodyparser = require('koa-bodyparser');
const logger = require('koa-logger');

const index = require('./routes/index');
const users = require('./routes/users');
const config = require('./config')[env];
const db = require('./libs/db');
const error = require('./middleware/error');
const res = require('./middleware/res');
const session = require('./middleware/session');
const auth = require('./middleware/auth');


process.env.dataDir = __dirname;

// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}));
app.use(json());
app.use(logger());
app.use(res);
app.use(error);
app.use(require('koa-static')(__dirname + '/public'));



// logger
app.use(async (ctx, next) => {
  const start = new Date();
  await next();
  const ms = new Date() - start;
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
});

app.use(session);
app.use(auth);
// routes
app.use(index.routes(), index.allowedMethods());
app.use(users.routes(), users.allowedMethods());


app.listen(`${config.port}`);
console.log(`listen ${config.port} ...`);

module.exports = app;
