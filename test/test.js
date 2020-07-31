"use strict";

var path = require("path");
var hashAssets = require("../index.js");
var siteroot = path.join(__dirname, "html");

async function main() {
  siteroot = path.normalize(path.resolve(siteroot + "/"));

  console.info("Working from '%s'\n", siteroot);
  return hashAssets(siteroot)
    .then(function (changes) {
      console.info("Renamed:");
      Object.keys(changes.renamed).forEach(function (name) {
        console.info("\t'%s' => '%s'", name, changes.renamed[name]);
      });
      console.info("Rewrote urls in each of:");
      changes.rewritten.forEach(function (name) {
        console.info("\t'%s'", name);
      });
    })
    .then(function () {
      console.info("\nPASS (probably).\n");
    })
    .catch(function (err) {
      console.error("\nFAIL: %s\n", err.message);
      process.exit(1);
    });
}

main();
