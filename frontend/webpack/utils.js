const fs = require('fs');
const { promisify } = require('util');

const readdir = promisify(fs.readdir);
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const readJsonFile = async path => JSON.parse(await readFile(path, 'utf8'));

module.exports = {
  readFile,
  writeFile,
  readdir,
  readJsonFile
};
