FROM node:9.11.2-jessie

WORKDIR /home/node/app
USER node

ENV NODE_ENV=prod

COPY ./build /home/node/app

ENTRYPOINT /home/node/app/entrypoint.sh
