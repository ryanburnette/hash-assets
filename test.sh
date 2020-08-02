#!/bin/bash

set -e
set -u

rsync -a --delete ./test/html_/ ./test/html/
node test/test.js
