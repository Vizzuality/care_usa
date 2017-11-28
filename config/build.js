const { exec } = require('child_process');

require('dotenv').config({ silent: true });

const script = `(cd map; npm run build) && (cd stories; NODE_PATH=src npm run build)`;

const child = exec(script);
child.stdout.pipe(process.stdout);
child.stderr.pipe(process.stderr);