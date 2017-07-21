const childProcess = require('child_process');
const Debug = require('debug');
const path = require('path');
const {promisify} = require('util');

const pkg = require('./package.json');

const debug = new Debug(pkg.name);
const execFileAsync = promisify(childProcess.execFile);

exports.push = async (script, options) => {
  script = path.join(__dirname, script);
  debug('script: ', script);
  debug('options: ', options);
  let args = [];
  if (typeof options === 'object') {
    let ref = options.ref;
    if (ref) {
      const head = 'refs/heads/';
      const headIndex = ref.indexOf(head);
      if (headIndex >= 0) {
        let branch = ref.substring(headIndex + head.length, ref.length);
        if (branch && branch.length > 0) {
          args.push('-b');
          args.push(branch);
        }
      }
    }
  }

  let result = await execFileAsync(script, args);
  return result && result.stdout;
};

exports.other = async (script, options) => {
  script = path.join(__dirname, script);
  debug('script: ', script);
  debug('options: ', options);

  let result = await execFileAsync(script);
  return result && result.stdout;
};
