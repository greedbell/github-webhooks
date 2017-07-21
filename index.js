const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const koaBunyanLogger = require('koa-bunyan-logger');
// import cors from 'kcors'
const serve = require('koa-static');
const path = require('path');
const Debug = require('debug');
const crypto = require('crypto');
const fs = require('fs');
const {promisify} = require('util');

const {push, other} = require('./events');

const pkg = require('./package.json');
const config = require('./config.json');

const app = new Koa();
const debug = new Debug(pkg.name);
const access = promisify(fs.access);
const open = promisify(fs.open);
const unlink = promisify(fs.unlink);

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
  let result;
  for (let webhook of config) {
    debug(webhook);
    if (webhook.path === requestPath && webhook.secret === requestQuery.secret) {
      let key = _md5(`${webhook.path}-${webhook.secret}`);
      let lockFile = path.join('/var/tmp/', `${key}.lock`);
      debug('lockFile', lockFile);
      try {
        try {
          await access(lockFile);
          ctx.body = 'Same task is running! Please wait a moment';
          return;
        } catch (err) {
          debug('lockFile is not existed');
        }

        try {
          await open(lockFile, 'w');
        } catch (err) {
          debug('open or close lock file failed');
        }

        if (webhook.event === 'push') {
          result = await push(webhook.script, payload);
        } else {
          result = await other(webhook.script, payload);
        }
      } catch (err) {
        debug(err);
      } finally {
        try {
          await unlink(lockFile);
        } catch (err) {
          debug('delete lock file failed');
        }
      }
      break;
    }
  }
  ctx.body = result || 'failed';
});

function _md5 (data) {
  let hash = crypto.createHash('md5');
  return hash.update(data).digest('hex');
}

let port = process.env.PORT || 4200;
app.listen(port);
