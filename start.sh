#!/bin/bash
forever stopall
forever start -a -l forever.log -o danbot.log -e errors.log index.js
