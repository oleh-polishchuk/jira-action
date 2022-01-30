#!/usr/bin/env bash

npm install
npm run build
npm run build:cleanup

git add .
git commit -m 'Update package'
git tag -a -m 'My first action release' v2.0
git push --follow-tags
git push
