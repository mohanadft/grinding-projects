#!/usr/bin/env node
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const { checkFile } = require('../utils/fileUtils');
const { bytes, characters, words, lines } = require('../utils/countOperations');

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
];

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
    console.log(lines({ flag: 'l', inputData, argv }));
  } else if (argv.c !== undefined) {
    console.log(bytes({ flag: 'c', inputData, argv }));
  } else if (argv.w !== undefined) {
    console.log(words({ flag: 'w', inputData, argv }));
  } else if (argv.m !== undefined) {
    console.log(characters({ flag: 'm', inputData, argv }));
  } else {
    let flag = '_';
    let file = checkFile({ flag, inputData, argv });

    console.log(
      `${lines({ flag, inputData, argv })} ${words({
        flag,
        inputData,
        argv
      })} ${bytes({ flag, inputData, argv })} ${file}`
    );
  }
  process.exit(0);
};

const flagExists = flag => {
  return argv[flag] !== undefined && argv[flag].length > 0;
};

if (
  flagExists('_') ||
  flagExists('c') ||
  flagExists('m') ||
  flagExists('w') ||
  flagExists('l')
)
  main();
