# [asset-hash](https://github.com/ryanburnette/asset-hash)

[![repo](https://img.shields.io/badge/repository-Github-black.svg?style=flat-square)](https://github.com/ryanburnette/asset-hash) [![npm](https://img.shields.io/badge/package-NPM-green.svg?style=flat-square)](https://www.npmjs.com/package/@ryanburnette/asset-hash)

An asset hash script for static websites.

- works in .css and .js files
- find the hash of a given file
- rename the file with the hash
- gz the file in place for web servers that support precompressed assets
- update all the references to the file
- requires that all references be made from `/`, no relative references, TODO
  improve
- works in place, so make a copy before calling if that matters

## Install

```bash
npm install -g @ryanburnette/asset-hash
```

## Use

```
assethash public/
```

## Warning

I reference all my assets relative to root. This library expects that and will
break if you aren't doing the same.
