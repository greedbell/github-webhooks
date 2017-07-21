const childProcess = require('child_process');
const Debug = require('debug');
const path = require('path');

const pkg = require('./package.json');

const debug = new Debug(pkg.name);

exports.push = (script, options) => {
  script = path.join(__dirname, script);
  debug('script: ', script);
  debug('options: ', options);
  let args = [];
  options.ref && args.push(options.ref);

  childProcess.execFile(script, args, (err, stdout, stderr) => {
    debug('err: ', err);
    debug('stdout: ', stdout);
    debug('stderr: ', stderr);
  });
};

exports.issue = (script) => {
  debug(script);
};
