FROM node:14-alpine3.12

RUN yarn install

RUN yarn build
EXPOSE 3000
# TODO: ENVS

CMD ["node", "dist/main.js"]
