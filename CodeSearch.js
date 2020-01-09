const ChildProcess = require('child_process');
const Git = require('simple-git/promise');
const { credentials } = require('./config');

const exec = cmd => new Promise((resolve, reject) => ChildProcess.exec(cmd, undefined, (error, stdout, stderr) => {
  if (error) {
    return reject(stderr);
  }

  return resolve(stdout);
}));

class CodeSearch {
  constructor(project) {
    this.project = project;
  }

  search(query) {
    return exec(`rm -rf repos/${this.project}`).then(
      () => Git().clone(`https://${credentials}@github.com/rapid7/${this.project}.git`, `repos/${this.project}`)
    ).then(
      () => Git(`repos/${this.project}`).addConfig('grep.lineNumber', 'true')
    ).then(
      () => Git(`repos/${this.project}`).raw([ 'grep', query ])
    );
  }
}

module.exports = CodeSearch;