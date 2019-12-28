#!/bin/bash
rm -rf /Users/sucaiquan/code/pagoda/quick-bi/node_modules/@pagodas/egg-routing-controllers-swagger
npm run tsc
rsync -a --exclude  node_modules/ --exclude  .git/ --exclude  .idea/  ./  /Users/sucaiquan/code/pagoda/quick-bi/node_modules/@pagodas/egg-routing-controllers-swagger
npm run clean
cd /Users/sucaiquan/code/pagoda/quick-bi/node_modules/@pagodas/egg-routing-controllers-swagger
find .|grep -v -E '\./(node_modules|typing)/.*$'|grep -E '.*/[^.]+\.ts$'|xargs rm
npm i --production
