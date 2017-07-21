const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const koaBunyanLogger = require('koa-bunyan-logger');
// import cors from 'kcors'
const serve = require('koa-static');
const path = require('path');
const Debug = require('debug');

const {push, issue} = require('./events');

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

app.use(ctx => {
  const requestPath = ctx.request.path;
  const requestQuery = ctx.request.query;
  debug(requestPath);
  debug(requestQuery);
  for (let webhook of config) {
    debug(webhook);
    if (webhook.path === requestPath && webhook.secret === requestQuery.secret) {
      if (webhook.event === 'push') {
        push(webhook.script, requestQuery);
      } else if (webhook.event === 'issues') {
        issue(webhook.script, requestQuery);
      }
      break;
    }
  }
  ctx.body = 'Hello World';
});

let port = process.env.PORT || 4200;
app.listen(port);
