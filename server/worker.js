// setup inspired by github.com/node-workers-example/worker.js
const throng = require('throng');
const Queue = require('bull');
const {
  executeQueryBuilder
} = require('./helper')

let REDIS_URL = process.env.REDIS_URL || 'redis://127.0.0.1:6379';
let workers = process.env.WEB_CONCURRENCY || 2;
let maxJobsPerWorker = 50;

function start() {
  let queryBuilderQueue = new Queue('queryBuilder', REDIS_URL)

  queryBuilderQueue.process(maxJobsPerWorker, async (job) => {
    console.log(job.data) 
    if (job.data.jobType == 'EXECUTE_QUERY_BUILDER') {
      let queryBuilderResults = await executeQueryBuilder()
      return queryBuilderResults
    }
  })
}

// Initialize the clustered worker process
// See: https://devcenter.heroku.com/articles/node-concurrency for more info
throng({workers, start})