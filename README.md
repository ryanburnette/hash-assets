# [hash-assets](https://github.com/ryanburnette/hash-assets)

[![repo](https://img.shields.io/badge/repo-Gitea-black.svg?style=flat-square)](https://github.com/ryanburnette/hash-assets) [![npm](https://img.shields.io/badge/pkg-NPM-green.svg?style=flat-square)](https://www.npmjs.com/package/@ryanburnette/hash-assets)

Hash assets for static websites.

## Features

- works on .css and .js files
- finds the hash of a given file
- renames the file to include the hash
- update all .html file references to hashed .css and .js files with hashed filename
- support absolute references, ie. `/css/main.css`
- support children relative from `.`, ie. `css/main.css` or `./css/main.css`
- **WARNING** does not support relative from parents `..`, such as
  `../css/main.css` 
- **WARNING** rewrites in place, so make a copy before calling if that matters
- TODO gz the file in place for web servers that support precompressed assets

## Usage

You can use hash-assets as a command line tool, or as a JavaScript library.

### CLI

```bash
npm install -g @ryanburnette/hash-assets
hash-assets public/
```

### CLI (npx)

```bash
npm install --save @ryanburnette/hash-assets
npx hash-assets public/
```

### Library

```bash
npm install --save @ryanburnette/hash-assets
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

## Warnings

In my own projects I reference all assets relative to root. Other approaches
are not currently being tested.

This library should also handle child-relative references `./`.

This library does not a handle parent-relative references `../`.

This library does not respect [`<base>`
urls](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/base).

I use this library as a build step, so it rewrites in place.

Pull requests are welcomed.
