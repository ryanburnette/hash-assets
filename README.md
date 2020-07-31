# [hash-assets](https://github.com/ryanburnette/asset-hash)

[![repo](https://img.shields.io/badge/repository-Github-black.svg?style=flat-square)](https://github.com/ryanburnette/asset-hash) [![npm](https://img.shields.io/badge/package-NPM-green.svg?style=flat-square)](https://www.npmjs.com/package/@ryanburnette/asset-hash)

An script for asset hash script for static websites.

- works in .css and .js files
- find the hash of a given file
- rename the file with the hash
- gz the file in place for web servers that support precompressed assets
- update all the references to the file
- requires that all references be made from `/`, no relative references
  - TODO improve
- **rewrites in place**, so make a copy before calling if that matters

## Usage

You can use hash-assets as a command line tool, or as a JavaScript library.

### CLI

```bash
npm install -g @ryanburnette/asset-hash
```

```bash
hash-assets public/
```

With `npx`:

```bash
npm install --save @ryanburnette/asset-hash
npx hash-assets public/
```

### JS

```bash
npm install --save @ryanburnette/asset-hash
```

```js
"use strict";

var hashAssets = require("../index.js");
var siteroot = "/home/me/sites/example.com/public/";

console.info("\nWorking from '%s'", siteroot);
hashAssets(siteroot)
  .then(function (changes) {
    console.info("\nRenamed:");
    Object.keys(changes.renamed).forEach(function (name) {
      console.info("\t'%s' => '%s'", name, changes.renamed[name]);
    });
    console.info("\nRewrote urls in each of:");
    changes.rewritten.forEach(function (name) {
      console.info("\t'%s'", name);
    });
  })
  .then(function () {
    console.info("\nComplete.\n");
  })
  .catch(function (err) {
    console.error("something bad happened", err);
  });
```

## Example

```bash
rsync -a --delete ./test/html_/ ./test/html/
hash-assets test/html
```

```txt
Working from '/Users/me/github.com/ryanburnette/asset-hash/test/html'

Renamed:
        '/js/main.js' => '/js/main.b58d988070d02e44d27a6b019e23a1665bd1f790.js'
        '/foo/js/main.js' => '/foo/js/main.b58d988070d02e44d27a6b019e23a1665bd1f790.js'
        '/foo/css/style.css' => '/foo/css/style.e0bc30e345c7b5fc33f2186bd2a8d387b088e1eb.css'
        '/css/style.css' => '/css/style.e0bc30e345c7b5fc33f2186bd2a8d387b088e1eb.css'

Rewrote urls in each of:
        '/absolute.html'
        '/relative.html'
        '/foo/absolute.html'
        '/foo/relative.html'

Complete.
```

## Warning

I reference all my assets relative to root. This library expects that and will
break if you aren't doing the same.
