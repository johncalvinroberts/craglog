# CRAGLOG

### Tech stack
This app is using a monorepo -- both frontend, backend, and deployment related code lives in this repo.
#### Data persistence
* mongo db v4.0.1
* Redis

#### Backend
* [fastify](https://github.com/fastify/fastify)
* [bull](https://github.com/OptimalBits/bull)

#### Frontend
* React
* [Chakra-ui](https://chakra-ui.com)


### Scraping The Crag 
* Area Search: https://www.thecrag.com/climbing/world/search?S=lions%20head&only=areas
* Route Search: https://www.thecrag.com/climbing/world/routes/search/cracka%20lackin
* Area detail: 
  - https://www.thecrag.com/climbing/china-mainland/zhejiang-jiangsu/area/563680785
  - https://www.thecrag.com/area/563680785
* Route detail: 
  - https://www.thecrag.com/climbing/china-mainland/zhejiang-jiangsu/route/1132935318
  - https://www.thecrag.com/route/1132935318


### Environment variables

#### backend
```
MONGODB_URL
REDIS_URL
JWT_SECRET
DEBUG #"scraper:*,app:*"
API_URL
MAX_PAGE #6285
LIST_SCRAPE_CONCURRENCY #2
ROUTE_SCRAPE_CONCURRENCY #10
ADMIN_USER
ADMIN_PASS
ADMIN_EMAIL
WORKER_ACCESS_TOKEN
```

#### frontend
```
WEBPACK_DEV_PORT=1234
API_BASE_URL=http://localhost:3000
API_BASE_PATH=/api/v1
```

### Make Commands
`docker-up`
`docker-down`
`restart-docker`
`bootstrap-dev`
`start-backend`
`dev-backend`
`dev-jobs`
`dev-all` - run with `make -j dev-all` to run backend and jobs
`dev-frontend`
`seed`
