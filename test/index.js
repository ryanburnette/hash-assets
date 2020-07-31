'use strict';

var walk = require('walk');
var path = require('path');
var createHashFromFile = require('../lib/create-hash-from-file');
var fs = require('fs').promises;

var assets = {};

async function hashAll(cwd, dirname) {
  var hashable = ['.css', '.js'];

  return new Promise(function (resolve) {
    var walker = walk.walk(dirname);
    walker.on('file', function (root, stats, next) {
      console.log('cwd', cwd, 'root', root, 'rel', stats.name);
      var relpath = path.join(root, stats.name);
      var extname = path.extname(stats.name);

      if (!hashable.includes(extname)) {
        console.log('skipping', relpath);
        next();
        return;
      }

      var abspath = '/' + relpath;
      createHashFromFile(relpath)
        .then(function (hash) {
          //var abs = fullpath.slice(cwd.length);
          assets[abspath] = { abspath, stats, hash };
          next();
        })
        .catch(function (err) {
          console.error('error', err.message);
        });
    });
    walker.on('end', function () {
      console.log(assets);
      resolve();
    });
  });
}

async function replaceAll(cwd, dirname) {
  var replaceable = ['.html'];

  return new Promise(async function (resolve) {
    var walker = walk.walk(dirname);
    walker.on('file', function (root, stats, next) {
      console.log('cwd', cwd, 'root', root, 'rel', stats.name);
      var relpath = path.join(root, stats.name);
      var extname = path.extname(stats.name);

      if (!replaceable.includes(extname)) {
        console.log('skipping', relpath);
        next();
        return;
      }

      var abspath = '/' + relpath;
      var body = await fs.readFile(relpath, 'utf8');
      body = body.replace(abspath, abspath.split(".").reverse().slice(1).reverse().join('.') + '.' + assets[abspath].hash + '.' + extname);
      fs.writeFile(relpath, body, 'utf8');
    });
    walker.on('end', function () {
      console.log(assets);
      resolve();
    });
  });
}

if (!process.argv[2]) {
  console.error('Usage: asset-hash ./path/to/dir/');
  process.exit(1);
}

hashAll(process.cwd(), process.argv[2])
  .then(function () {
    console.info('Hashed Everything.');
    return replaceAll(process.cwd(), process.argv[2]).then(function () {
      console.info('Replaced Everything.');
    });
  })
  .catch(function (err) {
    console.error('something bad happened', err);
  });
