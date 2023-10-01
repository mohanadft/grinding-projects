const fs = require('fs');

function getContent({ flag, fileName, inputData }) {
  if (!fileName) {
    return inputData;
  }
  return fs.readFileSync(fileName, flag === 'c' ? '' : 'utf8');
}

function fileExists(fileName) {
  return fs.existsSync(fileName);
}

function checkFile({ flag, inputData, argv }) {
  const file = flag === '_' ? String(argv[flag][0]) : String(argv[flag]);

  if (inputData || file === 'undefined') {
    return '';
  }

  const fileExtensions = /\.(json|txt|doc|docx|html)$/gi;

  if (!fileExtensions.test(file)) {
    console.log(
      'Invalid file extension. Supported extensions: json, txt, doc, docx, html'
    );
    process.exit(1);
  }

  if (!fileExists(file)) {
    console.log('File Does not exist');
    process.exit(1);
  }

  return file;
}

module.exports = { getContent, checkFile };
