#!/bin/bash

npm run build

node build/cron/kashika.js &
node build/cron/portalCheck.js &
node build/cron/syncDoNetCust.js &