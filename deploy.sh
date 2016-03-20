#!/bin/bash

git checkout gh-pages
git add index.html
git add js/app.js
git add node_modules/todomvc-app-css/index.css
git add node_modules/todomvc-common/base.css
git add node_modules/todomvc-common/base.js
git config --global user.name 'bouzuya'
git config --global user.email 'm@bouzuya.net'
git commit -m "$(date +'%Y-%m-%dT%H:%M:%S%z')"
git push origin gh-pages

