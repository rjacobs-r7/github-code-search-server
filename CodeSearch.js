const ChildProcess = require('child_process');
const Fs = require('fs');
const Git = require('simple-git/promise');
const { credentials } = require('./config');

const exec = cmd => new Promise((resolve, reject) => ChildProcess.exec(cmd, undefined, (error, stdout, stderr) => {
  if (error) {
    return reject(stderr);
  }

  return resolve(stdout);
}));

const clone = projectName => {
  if (Fs.existsSync(`repos/${projectName}`)) {
    return Promise.resolve(true);
  }

  return Git().clone(`https://${credentials}@github.com/rapid7/${projectName}.git`,
    `repos/${projectName}`,
    { '--depth': 1 });
};

class CodeSearch {
  constructor(project) {
    this.project = project;
  }

  search(query, { A = 2, B = 2 }) {
    return clone(this.project)
    .then(
      () => Git(`repos/${this.project}`).addConfig('grep.lineNumber', 'true')
    ).then(
      () => Git(`repos/${this.project}`).raw([ 'grep', `-A ${A}`, `-B ${B}`, query ])
    );
  }
}

module.exports = CodeSearch;