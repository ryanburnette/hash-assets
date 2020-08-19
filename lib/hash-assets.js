'use strict';

var walk = require('walk');
var path = require('path');
var createHashFromFile = require('./create-hash-from-file.js');
var fs = require('fs').promises;
var toRegex = require('to-regex');

async function hashAll(siteroot) {
  var hashable = ['.css', '.js'];
  var assets = {};

  return new Promise(function (resolve, reject) {
    var walker = walk.walk(siteroot);
    walker.on('error', reject);
    walker.on('file', async function (root, stats, next) {
      var filepath = path.join(root, stats.name);
      var absurl = path.join(root.slice(siteroot.length) || '/', stats.name);
      var extname = path.extname(stats.name);

      if (!hashable.includes(extname)) {
        //console.log("h", "skipping", filepath);
        next();
        return;
      }
      //console.log("h", "filepath", filepath, "absurl", absurl);

      var hash = await createHashFromFile(filepath).catch(reject);
      if (!hash) {
        return;
      }

      var hashurl = absurl.split('.').reverse().slice(1).reverse().join('.');
      hashurl = hashurl + '.' + hash + extname;

      var hashpath = path.join(siteroot, hashurl);
      assets[absurl] = { filepath, absurl, stats, hash, hashurl, hashpath };

      fs.rename(filepath, hashpath).then(next).catch(reject);
    });
    walker.on('end', function () {
      resolve(assets);
    });
  }).then(function () {
    return assets;
  });
}

async function replaceAll(assets, siteroot) {
  var replaceable = ['.html'];
  var rewritten = [];

  return new Promise(function (resolve, reject) {
    var walker = walk.walk(siteroot);
    walker.on('error', reject);
    walker.on('file', async function (root, stats, next) {
      var filepath = path.join(root, stats.name);
      var sitepre = root.slice(siteroot.length) || '/';
      var absurl = path.join(sitepre, stats.name);
      var extname = path.extname(stats.name);

      if (!replaceable.includes(extname)) {
        //console.log("x", "skipping", filepath);
        next();
        return;
      }
      //console.log("x", "filepath", filepath, "absurl", absurl);

      var body = await fs.readFile(filepath, 'utf8').catch(reject);
      Object.keys(assets).forEach(function (absname) {
        var stats = assets[absname];
        body = body.replace(
          toRegex("'" + stats.absurl, { flags: 'gm', contains: true }),
          "'" + stats.hashurl
        );
        body = body.replace(
          toRegex('"' + stats.absurl, { flags: 'gm', contains: true }),
          '"' + stats.hashurl
        );
        body = body.replace(
          toRegex('=' + stats.absurl, { flags: 'gm', contains: true }),
          '=' + stats.hashurl
        );
        var relurl = stats.absurl.slice(sitepre.length).replace(/^\//, '');
        if (sitepre === stats.absurl.slice(0, sitepre.length)) {
          body = body.replace(
            toRegex("'" + relurl, { flags: 'gm', contains: true }),
            "'" + stats.hashurl
          );
          body = body.replace(
            toRegex('"' + relurl, { flags: 'gm', contains: true }),
            '"' + stats.hashurl
          );
          body = body.replace(
            toRegex('=' + relurl, { flags: 'gm', contains: true }),
            '=' + stats.hashurl
          );
          body = body.replace(
            toRegex("'./" + relurl, { flags: 'gm', contains: true }),
            "'" + stats.hashurl
          );
          body = body.replace(
            toRegex('"./' + relurl, { flags: 'gm', contains: true }),
            '"' + stats.hashurl
          );
          body = body.replace(
            toRegex('=./' + relurl, { flags: 'gm', contains: true }),
            '=' + stats.hashurl
          );
        }
      });
      rewritten.push(absurl);

      return fs
        .writeFile(filepath, body, 'utf8')
        .then(next)
        .catch(function (err) {
          reject(err);
        });
    });
    walker.on('end', function () {
      resolve(rewritten);
    });
  });
}

module.exports = async function hashAssets(siteroot) {
  var changes = { renamed: {}, rewritten: [] };

  var assets = await hashAll(siteroot);
  Object.values(assets).forEach(function (asset) {
    //changes.renamed[asset.filepath] = asset.hashpath;
    changes.renamed[asset.absurl] = asset.hashurl;
  });

  var rewritten = await replaceAll(assets, siteroot);
  changes.rewritten = rewritten;
  return changes;
};
