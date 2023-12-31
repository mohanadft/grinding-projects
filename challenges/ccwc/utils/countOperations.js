const { checkFile, getContent } = require('./fileUtils');

function lines({ flag, inputData, argv }) {
  let res = '';
  const fileName = checkFile({ flag, inputData, argv });

  if (!fileName.length) {
    res = inputData.split('\n').length - 1;
  } else {
    const fileContent = getContent({ flag, fileName, inputData });
    res = fileContent.split('\n').length - 1;
  }

  if (flag === '_' || inputData) return `${res}`;

  return `${res} ${fileName}`;
}

function bytes({ flag, inputData, argv }) {
  let res = '';
  const fileName = checkFile({ flag, inputData, argv });

  if (!fileName.length) {
    res = Buffer.from(inputData).length;
  } else {
    const fileContent = getContent({ flag, fileName, inputData });
    res = fileContent.length;
  }

  if (flag === '_' || inputData) return `${res}`;

  return `${res} ${fileName}`;
}

function words({ flag, inputData, argv }) {
  let res = '';
  const fileName = checkFile({ flag, inputData, argv });

  if (!fileName.length) {
    res = inputData
      .split('\n')
      .map(e => e.split(' ').filter(e => e.length >= 1))
      .reduce((acc, curr) => acc + curr.length, 0);
  } else {
    const fileContent = getContent({ flag, fileName, inputData });
    res = fileContent
      .split('\n')
      .map(e => e.split(' ').filter(e => e.length >= 1))
      .reduce((acc, curr) => acc + curr.length, 0);
  }

  if (flag === '_' || inputData) return `${res}`;

  return `${res} ${fileName}`;
}

function characters({ flag, inputData, argv }) {
  let res = '';

  const fileName = checkFile({ flag, inputData, argv });

  if (!fileName.length) {
    res = inputData.split('').length;
  } else {
    const fileContent = getContent({ flag, fileName, inputData });
    res = fileContent.split('').length;
  }

  if (flag === '_' || inputData) return `${res}`;

  return `${res} ${fileName}`;
}

module.exports = { characters, bytes, words, lines };
