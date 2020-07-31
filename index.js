'use strict';

var path = require('path');
var fs = require('fs');
var walk = require('walk');
var crypto = require('crypto');

var assetsExts = ['.js', '.css'];
var htmlExts = ['.html'];

function assetHash(dir) {
  console.log(dir);
  var assets = [];
  var documents = [];

  return Promise.resolve()
    .then(function () {
      return new Promise(function (resolve) {
        var walker = walk.walk(dir);
        walker.on('file', function (root, stats, next) {
          if (stats.type === 'file') {
            var filepath = path.join(root, stats.name);
            var refpath =
              '/' + path.join(root.replace(dir + '/', ''), stats.name);
            var ext = path.extname(filepath);
            if (assetsExts.includes(ext)) {
              assets.push({
                filepath,
                refpath,
                ext
              });
            }
          }
          next();
        });
        walker.on('end', function () {
          resolve();
        });
      });
    })
    .then(function () {
      return assets.reduce(function (p, f, i) {
        return p
          .then(function () {
            return createHashFromFile(f.filepath);
          })
          .then(function (hash) {
            hash = hash.substr(0, 16);
            assets[i].hash = hash;
            assets[i].hashref = assets[i].refpath.replace(
              assets[i].ext,
              `-${hash}${assets[i].ext}`
            );
          });
      }, Promise.resolve());
    })
    .then(function () {
      return new Promise(function (resolve) {
        var walker = walk.walk(dir);
        walker.on('file', function (root, stats, next) {
          if (stats.type === 'file') {
            var filepath = path.join(root, stats.name);
            var refpath = '/' + path.join(root.replace(dir, ''), stats.name);
            var ext = path.extname(filepath);
            if (htmlExts.includes(ext)) {
              documents.push({
                filepath,
                refpath
              });
            }
          }
          next();
        });
        walker.on('end', function () {
          resolve();
        });
      });
    })
    .then(function () {
      return documents.reduce(function (p, doc) {
        return p
          .then(function () {
            return fs.promises.readFile(doc.filepath, 'utf8');
          })
          .then(function (data) {
            return assets
              .reduce(function (p, f) {
                return p.then(function () {
                  var reg = new RegExp(f.refpath);
                  data = data.replace(reg, f.hashref);
                });
              }, Promise.resolve())
              .then(function () {
                return fs.promises.writeFile(doc.filepath, data);
              })
              .then(function () {
                console.log('HASHED REFS', doc.filepath);
              });
          });
      }, Promise.resolve());
    });
}

async function createHashFromFile(filePath) {
  return new Promise(resolve => {
    const hash = crypto.createHash('sha1');
    fs.createReadStream(filePath)
      .on('data', data => hash.update(data))
      .on('end', () => resolve(hash.digest('hex')));
  });
}

module.exports = assetHash;

if (module === require.main && fs.existsSync(process.argv[2])) {
  assetHash(process.argv[2]);
}
