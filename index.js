'use strict';

var path = require('path');
var fs = require('fs');
var walk = require('walk');
var crypto = require('crypto');

var assetsExts = ['.js', '.css'];

function assetHash(dir) {
  var manifest = [];

  return Promise.resolve().then(function () {
    return new Promise(function (resolve) {
      var walker = walk.walk(dir);
      walker.on('file', function (root, stats, next) {
        if (stats.type === 'file') {
          var filepath = path.join(root, stats.name);
          var ext = path.extname(filepath);
          if (assetsExts.includes(ext)) {
            manifest.push({
              path: filepath,
              ext
            });
          }
        }
        next();
      });
      walker.on('end', function () {
        resolve();
      });
    }).then(function () {
      console.log(manifest);
    });
  });
  // found a css
  // hash it
  // add it to the manifest
  // found a js
  // hash it
  // add it to the manifest
  // walk the dir looking for html
  // found an html
  // put it in cheerio
  // look for link elements referencing assets in the manifest, replace the reference
  // look for script elements referencing assets in the manifest, replace the reference
}

module.exports = assetHash;

assetHash('./test/public');
