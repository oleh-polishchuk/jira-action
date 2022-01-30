#!/usr/bin/env bash

npm install
npm run build
npm run build:cleanup

git add .
git commit -m'Update package'
git push
