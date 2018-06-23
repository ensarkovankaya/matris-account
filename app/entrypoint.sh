#!/usr/bin/env bash
set -e

if [ "$1" == "bash" ]; then
    /usr/bin/env bash
elif [ "$1" == "test" ]; then
    npm run test
else
    if [ "$NODE_ENV" == "development" ]; then
        npm install --only=prod
    else
        npm install
    fi

    # If environment development use nodemon to watch file changes
    # Otherwise just run the server
    if [ "$NODE_ENV" == "development" ]; then
        npm run watch
    else
        npm run start
    fi
fi