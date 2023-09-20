#!/usr/bin/env node
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const fs = require('fs');

const allowedFlags = [
  'l',
  'lines',
  'c',
  'bytes',
  'w',
  'words',
  'm',
  'characters',
  '_',
  '$0'
]; // List of allowed flags

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
  })
  .check(argv => {
    // Check if any unsupported flag is passed
    const unsupportedFlags = Object.keys(argv).filter(
      flag => !allowedFlags.includes(flag)
    );

    if (unsupportedFlags.length > 0) {
      throw new Error(`Unsupported flags: ${unsupportedFlags.join(', ')}`);
    }

    return true;
  }).argv;

let inputData = '';

process.stdin.on('data', function (data) {
  inputData += data;
});

process.stdin.on('end', function () {
  main(inputData);
});

const main = inputData => {
  if (argv.l !== undefined) {
    console.log(lines('l', inputData));
  } else if (argv.c !== undefined) {
    console.log(bytes('c', inputData));
  } else if (argv.w !== undefined) {
    console.log(words('w', inputData));
  } else if (argv.m !== undefined) {
    console.log(characters('m', inputData));
  } else {
    let file = checkFile('_', inputData);

    console.log(
      `${lines('_', inputData)} ${words('_', inputData)} ${bytes(
        '_',
        inputData
      )} ${file || ''}`
    );
  }
  process.exit();
};

if (
  (argv.l !== undefined && argv.l.length > 0) ||
  (argv.c !== undefined && argv.c.length > 0) ||
  (argv.m !== undefined && argv.m.length > 0) ||
  (argv.w !== undefined && argv.w.length > 0) ||
  (argv._ !== undefined && argv._.length > 0)
)
  main();

function lines(flag, inputData) {
  let res = '';
  const fileName = checkFile(flag, inputData);

  if (!fileName) {
    res = inputData.split('\n').length - 1;
  } else {
    const fileName = checkFile(flag);
    const fileContent = fs.readFileSync(fileName, 'utf8');
    res = fileContent.split('\n').length - 1;
  }

  if (flag === '_' || inputData) return `${res}`;

  return `${res} ${fileName}`;
}

function bytes(flag, inputData) {
  let res = '';
  const fileName = checkFile(flag, inputData);

  if (!fileName) {
    res = Buffer.from(inputData).length;
  } else {
    const fileName = checkFile(flag);
    const fileContent = fs.readFileSync(fileName);
    res = fileContent.length;
  }

  if (flag === '_' || inputData) return `${res}`;

  return `${res} ${fileName}`;
}

function words(flag, inputData) {
  // TODO: Need some improvements, words count is not accurate.

  let res = '';
  const fileName = checkFile(flag, inputData);

  if (!fileName) {
    res = inputData.split(' ').filter(e => e.length >= 1).length;
  } else {
    const fileName = checkFile(flag);
    const fileContent = fs.readFileSync(fileName, 'utf8');
    res = fileContent.split(' ').filter(e => e.length >= 1).length;
  }

  if (flag === '_' || inputData) return `${res}`;

  return `${res} ${fileName}`;
}

function characters(flag, inputData) {
  let res = '';

  const fileName = checkFile(flag, inputData);

  if (!fileName) {
    res = inputData.split('').length;
  } else {
    const fileContent = fs.readFileSync(fileName, 'utf8');

    res = fileContent.split('').length;
  }

  if (flag === '_' || inputData) return `${res}`;

  return `${res} ${fileName}`;
}

function checkFile(flag, inputData) {
  const file = flag === '_' ? String(argv[flag][0]) : String(argv[flag]);

  if (inputData || file === 'undefined') {
    return false;
  }

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
