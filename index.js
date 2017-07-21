const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const koaBunyanLogger = require('koa-bunyan-logger');
// import cors from 'kcors'
const serve = require('koa-static');
const path = require('path');
const Debug = require('debug');

const {push, other} = require('./events');

const pkg = require('./package.json');
const config = require('./config.json');

const app = new Koa();
const debug = new Debug(pkg.name);

// bodyParser

app.use(bodyParser());

// static

app.use(serve(path.join(__dirname, './assets')));

// koa-bunyan-logger

app.use(koaBunyanLogger({
  name: pkg.name,
  level: 'debug'
}));
app.use(koaBunyanLogger.requestIdContext());
app.use(koaBunyanLogger.requestLogger({
  updateRequestLogFields: function (fields, err) {
    fields.body = this.request.body;
  },
  updateResponseLogFields: function (fields, err) {
    fields.body = this.response.body;
  }
}));

// cors

// app.use(cors());

app.use(async ctx => {
  const requestPath = ctx.request.path;
  const requestQuery = ctx.request.query;
  debug(requestPath);
  debug(requestQuery);
  let payload = typeof requestQuery === 'object' ? requestQuery.payload : null;
  payload = payload && JSON.parse(payload);
  debug(payload);
  let result;
  for (let webhook of config) {
    debug(webhook);
    if (webhook.path === requestPath && webhook.secret === requestQuery.secret) {
      if (webhook.event === 'push') {
        result = await push(webhook.script, payload);
      } else {
        result = await other(webhook.script, payload);
      }
      break;
    }
  }
  ctx.body = result || 'failed';
});

let port = process.env.PORT || 4200;
app.listen(port);
