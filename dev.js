const prompt = require('prompt');
const { exec } = require('child_process');

const schema = {
  properties: {
    app: {
      description: 'Choose an application, Map or Stories (m/s)',
      pattern: /^m{1}|s{1}$/,
      required: true
    }
  }
};
prompt.message = '';
prompt.start();

prompt.get(schema, (err, result) => {
  if (err) return console.log(err);

  const script = {
    m: '(cd map; npm start)',
    s: '(cd stories; npm start)'
  }[result.app];
  if (script) {
    const child = exec(script);
    child.stdout.pipe(process.stdout);
    child.stderr.pipe(process.stderr);
  } else {
    console.error('Nah ah!! (m/s): Map or Stories');
  }
});