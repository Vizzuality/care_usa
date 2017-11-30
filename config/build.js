const { exec } = require('child_process');

require('dotenv').config({ silent: true });

console.log('Building map app.');
const map = exec('cd map; npm run build', (...args) => onEnd('map', ...args));

console.log('Building stories app');
const stories = exec('cd stories; NODE_PATH=src npm run build', (...args) => onEnd('stories', ...args));

function onEnd(type, error, stdout, stderror) {
  if (stdout) console.log(stdout);
  if (stderror) console.error(stderror)
  console.log(`\n\n${type} build finished!`);
}