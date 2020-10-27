'use strict';

var crypto = require('crypto');
var fs = require('fs');

function createHashFromFile(filePath) {
  return new Promise((resolve) => {
    const hash = crypto.createHash('sha1');
    fs.createReadStream(filePath)
      .on('data', (data) => hash.update(data))
      .on('end', () => resolve(hash.digest('hex').substring(0, 20)));
  });
}

module.exports = createHashFromFile;
