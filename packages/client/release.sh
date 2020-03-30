#!/bin/bash

VERSION="$(node -p "require('./package.json').version")"

echo "export const version = '$VERSION';" > ./src/version.ts
