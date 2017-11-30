const { exec } = require('child_process');

let pending = 2;

console.log('Installing map app.');
const map = exec('cd map; npm install', (...args) => onEnd('map', ...args));

console.log('Installing stories app.');
const stories = exec('cd stories; npm install', (...args) => onEnd('stories', ...args));

const onEnd = (type, error, stdout, stderror) => {
  if (error) return;
  pending--;
  if (stdout) console.log(stdout);
  if (stderror) console.error(stderror);
  console.log(`\n\n${type} install finished! pending: ${pending}`);
  if (!pending) {
    const build = exec('npm run build');
    build.stdout.pipe(process.stdout);
    build.stderr.pipe(process.stderr);
  }
};