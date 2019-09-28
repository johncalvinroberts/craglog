# CRAGLOG

### Libs
* [fastify](https://github.com/fastify/fastify)
* [bull](https://github.com/OptimalBits/bull)

### Scraping The Crag 
* Area Search: https://www.thecrag.com/climbing/world/search?S=lions%20head&only=areas
* Route Search: https://www.thecrag.com/climbing/world/routes/search/cracka%20lackin
* Area detail: 
  - https://www.thecrag.com/climbing/china-mainland/zhejiang-jiangsu/area/563680785
  - https://www.thecrag.com/area/563680785
* Route detail: 
 - https://www.thecrag.com/climbing/china-mainland/zhejiang-jiangsu/route/1132935318
 - https://www.thecrag.com/route/1132935318


### `.env`
```
MONGODB_URL
REDIS_URL
JWT_SECRET
DEBUG #"scraper:*,app:*"
API_URL
MAX_PAGE #6285
LIST_SCRAPE_CONCURRENCY #2
ROUTE_SCRAPE_CONCURRENCY #10
```
