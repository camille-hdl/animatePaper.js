#! /bin/bash

DIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )


uglifyjs ${DIR}/../src/animation.js ${DIR}/../src/tween.js ${DIR}/../src/frameManager.js ${DIR}/../src/easing.js ${DIR}/../src/prophooks.js ${DIR}/../src/effects.js ${DIR}/../src/export.js  -c -m --wrap "animatePaper" -o ${DIR}/../dist/animatePaper.min.js


uglifyjs ${DIR}/../src/animation.js ${DIR}/../src/tween.js ${DIR}/../src/frameManager.js ${DIR}/../src/easing.js ${DIR}/../src/prophooks.js ${DIR}/../src/effects.js ${DIR}/../src/export.js  -b --wrap "animatePaper" --source-map ${DIR}/../dist/animatePaper.map --preamble "/* animatePaper.js - an animation library for paper.js. https://github.com/Eartz/animatePaper.js */" -o ${DIR}/../dist/animatePaper.js

yuidoc --config ${DIR}/../yuidoc.json -o ${DIR}/../doc ${DIR}/../src