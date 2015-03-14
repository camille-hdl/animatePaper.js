#! /bin/bash

DIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )

js-beautify ${DIR}/../src/animatePaper.js -o ${DIR}/../src/animatePaper.js

uglifyjs ${DIR}/../src/animatePaper.js -c -m -o ${DIR}/../dist/animatePaper.min.js

yuidoc --config ${DIR}/../yuidoc.json -o ${DIR}/../doc ${DIR}/../src