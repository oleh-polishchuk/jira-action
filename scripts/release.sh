#!/usr/bin/env bash

npm install
npm run build
npm run build:cleanup

git add .
git commit -m 'Update package'
git tag -a -m 'My first action release' v1.6
git push --follow-tags
git push
