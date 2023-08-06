// setup inspired by github.com/node-workers-example/worker.js
const throng = require('throng');
const Queue = require('bull');
const {
  executeQueryGPT
} = require('./helper')

let REDIS_URL = process.env.REDIS_URL || 'redis://127.0.0.1:6379';
let workers = process.env.WEB_CONCURRENCY || 2;
let maxJobsPerWorker = 50;

function start() {
  let queryGPTQueue = new Queue('queryGPT', REDIS_URL)

  queryGPTQueue.process(maxJobsPerWorker, async (job) => {
    let {sourceDataExtensionName, targetDataExtensionName, queryDescription} = job.data.userInput

    if (job.data.jobType == 'EXECUTE_QUERYGPT') {
      try {
        let queryGPTResults = await executeQueryGPT(sourceDataExtensionName, targetDataExtensionName, queryDescription)
        return queryGPTResults
      } catch(e) {
        console.log(e)
      }
    }
  })

  queryGPTQueue.on('failed', (job, err) => {
    console.log(`Job ${job.id} failed with error ${err.message}`);
  });
}

// Initialize the clustered worker process
// See: https://devcenter.heroku.com/articles/node-concurrency for more info
throng({workers, start})