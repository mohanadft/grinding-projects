#!/usr/bin/env node
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const fs = require('fs');

const argv = yargs(hideBin(process.argv))
  .option('l', {
    alias: 'lines',
    describe: 'Count lines in the specified file',
    type: 'string'
  })
  .option('c', {
    alias: 'bytes',
    describe: 'Count bytes in the specified file',
    type: 'string'
  })
  .option('w', {
    alias: 'words',
    describe: 'Count words in the specified file',
    type: 'string'
  })
  .option('m', {
    alias: 'characters',
    describe: 'Count characters in the specified file',
    type: 'string'
  });

if (argv.argv.l) {
  console.log(lines('l'));
} else if (argv.argv.c) {
  console.log(bytes('c'));
} else if (argv.argv.w) {
  console.log(words('w'));
} else if (argv.argv.m) {
  console.log(characters('m'));
} else {
  const file = checkFile('_');
  console.log(`${lines('_')} ${words('_')} ${bytes('_')} ${file}`);
}

function lines(flag) {
  const fileName = checkFile(flag);
  const fileContent = fs.readFileSync(fileName, 'utf8');
  const res = fileContent.split('\n').length - 1;

  if (flag === '_') return res;

  return res;
}

function bytes(flag) {
  const fileName = checkFile(flag);
  const fileContent = fs.readFileSync(fileName);
  const res = fileContent.length;

  if (flag === '_') return res;

  return `${res} ${fileName}`;
}

function words(flag) {
  // TODO: Need some improvements, words count is not accurate.
  const fileName = checkFile(flag);
  const fileContent = fs.readFileSync(fileName, 'utf8');
  const res = fileContent.split(' ').filter(e => e.length >= 1).length;

  if (flag === '_') return res;

  return `${res} ${fileName}`;
}

function characters(flag) {
  const fileName = checkFile(flag);
  const fileContent = fs.readFileSync(fileName, 'utf8');
  const res = fileContent.split('').length;

  if (flag === '_') return res;

  return `${res} ${fileName}`;
}

function checkFile(flag) {
  const file =
    flag === '_' ? String(argv.argv[flag][0]) : String(argv.argv[flag]);

  const fileExtensions = /\.(json|txt|doc|docx|html)$/gi;
  if (!fileExtensions.test(file)) {
    console.log(
      'Invalid file extension. Supported extensions: json, txt, doc, docx, html'
    );
    process.exit(1);
  }

  if (!fs.existsSync(file)) {
    console.log("File Doesn't exist");
    process.exit(1);
  }

  return file;
}
