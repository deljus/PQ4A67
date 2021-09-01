#!/bin/bash
node -v
npm install
npm run generate
npm run pull
npm run build
npm run serve