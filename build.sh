#!/bin/bash
rm -rf ./paloma-docs
git clone https://github.com/palomachain/paloma-docs.git
cd paloma-docs/docs
yarn install
yarn add -D vuepress
yarn build
cp -r src/.vuepress/dist ../../public/paloma-docs
cd ../../
