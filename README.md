# [hash-assets](https://github.com/ryanburnette/hash-assets)

[![repo](https://img.shields.io/badge/repo-Github-black.svg?style=flat-square)](https://github.com/ryanburnette/hash-assets)
[![npm](https://img.shields.io/badge/pkg-NPM-green.svg?style=flat-square)](https://www.npmjs.com/package/@ryanburnette/hash-assets)

Hash assets for static websites.

## Features

- recursively hashes the filenames of all `.css` and `.js` files and updates
  refererences in the `.html` files
- supports absolute references, ie. `/css/main.css`
- supports children relative from `.`, ie. `css/main.css` or `./css/main.css`
- **WARNING** does not support relative from parents `..`, such as
  `../css/main.css`
- **WARNING** does not respect
  [`<base>` urls](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/base).
- **WARNING** cli helper updates files in place

## TODO

- gzip assets for web servers that support precompressed assets

### cli

```bash
npm install -g @ryanburnette/hash-assets
```

```bash
hash-assets public/
```

### npx

```bash
npm install @ryanburnette/hash-assets
```

```bash
npx hash-assets public/
```

### js

```bash
npm install @ryanburnette/hash-assets
```

```js
'use strict';

var hashAssets = require('../index.js');
var siteroot = '/home/me/sites/example.com/public/';

console.info("\nWorking from '%s'", siteroot);
hashAssets(siteroot)
  .then(function (changes) {
    console.info('\nRenamed:');
    Object.keys(changes.renamed).forEach(function (name) {
      console.info("\t'%s' => '%s'", name, changes.renamed[name]);
    });
    console.info('\nRewrote urls in each of:');
    changes.rewritten.forEach(function (name) {
      console.info("\t'%s'", name);
    });
  })
  .then(function () {
    console.info('\nComplete.\n');
  })
  .catch(function (err) {
    console.error('something bad happened', err);
  });
```

## Example

```bash
rsync -a --delete ./test/html_/ ./test/html/
hash-assets test/html
```

```txt
Working from '/Users/me/github.com/ryanburnette/hash-assets/test/html'

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
