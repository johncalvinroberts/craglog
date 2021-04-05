FROM node:14-alpine3.12
WORKDIR /app
COPY . /app
RUN yarn build
EXPOSE 3000
# TODO: ENVS

CMD ["node", "dist/main.js"]
