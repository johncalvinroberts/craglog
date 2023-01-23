# [craglog](https://craglog.cc/)

This is a soon-to-be-deprecated sideproject that I spent way too much time on. 

It's basically a climbing journal for tracking accomplishments, ascents, and training.

### Tech stack

This app is using a monorepo -- both frontend, backend, and deployment related code lives in this repo.

#### Backend

* [Nest JS](https://nestjs.com/)
* [fastify](https://github.com/fastify/fastify)
* [bull](https://github.com/OptimalBits/bull)
* Redis
* Typescript

#### Frontend

* React
* [Chakra-ui](https://chakra-ui.com)
* [SWR](https://swr.vercel.app/)


### Environment variables

#### backend

```
DATABASE_HOST=localhost
DATABASE_PORT=5432
POSTGRES_USER=xxxx
POSTGRES_PASSWORD=xxx
POSTGRES_DB=xxx
JWT_SECRET=xxx
ADMIN_PASS=xxxx
ADMIN_EMAIL=xxxxx@gmail.com
ADMIN_USER=xxxx
USER_ONE_PASS=xxx
USER_ONE_EMAIL=xxx@x.com
USER_ONE_USER=xxxxxx
FRONTEND_URL=localhost:1234
MAIL_HOST
MAIL_PORT
MAIL_USER
MAIL_PASS
```

#### frontend

```
WEBPACK_DEV_PORT=1234
API_BASE_URL=http://localhost:3000
API_BASE_PATH=/api/v1
```

### Make Commands

* `docker-up`
* `docker-down`
* `restart-docker`
* `bootstrap-dev`
* `start-backend`
* `dev-backend`
* `dev-jobs`
* `dev-all` - run with `make -j dev-all` to run backend and jobs
* `dev-frontend`
* `seed`
