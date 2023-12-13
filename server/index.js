const express             = require('express')
const path                = require('path')
// const { readFileSync }    = require('fs')
const axios               = require('axios')
const env                 = require('dotenv').config()
const bodyParser          = require('body-parser')
let Queue = require('bull');
let REACT_APP_SFMC_AUTHORIGIN = process.env.REACT_APP_SFMC_AUTHORIGIN
let REDIS_URL = process.env.REDIS_URL || 'redis://127.0.0.1:6379';
let REACT_APP_SFMC_CLIENTID = process.env.REACT_APP_SFMC_CLIENTID_PUBLIC
let REACT_APP_REDIRECTURI = process.env.REACT_APP_REDIRECTURI
const SERVER_APP_FLAG = process.env.SERVER_APP_FLAG

const cors = require('cors')
const { initializeSDK } = require('./helper')

const isDev = process.env.NODE_ENV !== 'production'
const PORT = process.env.PORT || 5000


const app = express();
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cors())

// Priority serve any static files
app.use(express.static(path.resolve(__dirname, '../react-ui/build')))


// =======================================================
// QUEUES
// =======================================================
let queryGPTQueue = new Queue('queryGPT', REDIS_URL);


// =======================================================
// ROUTES
// =======================================================

app.get('/authorization', async (req, res) => {
  let url = `${REACT_APP_SFMC_AUTHORIGIN}v2/authorize?response_type=code&client_id=${encodeURIComponent(REACT_APP_SFMC_CLIENTID)}&redirect_uri=${encodeURIComponent(REACT_APP_REDIRECTURI)}`

  // only send auth url back if this is public app implementation (i.e. not server)
  if (!SERVER_APP_FLAG) {
    res.send(url)
  }
})

app.post('/authorization', async (req, res) => {
  // accept auth code
  let authCode = req.body.sfmc_authCode
  console.log('post to /authorization route ')
  // initialize sfmc SDK with it
  await initializeSDK(authCode)

  res.json({ message: 'SDK initialized', success: true})
})


app.get('/api/serverflag/', async (req, res) => {
  res.send(SERVER_APP_FLAG)
})

app.post('/api/queryGPT/', async (req, res) => {

  const { sourceDataExtensionName, targetDataExtensionName, queryDescription } = req.body

  try {
    const job = await queryGPTQueue.add({
      jobType: 'EXECUTE_QUERYGPT',
      userInput: {sourceDataExtensionName, targetDataExtensionName, queryDescription}
    })
    
    res.json({ jobState: await job.getState(), job })   
  } catch (error) {
    res.json({error})
  }
  
})

app.get('/api/queryGPT/:id', async (req, res) => {
  let id = req.params.id 

  if (id) {
    let job = await queryGPTQueue.getJob(id)
    res.json({ id, job, jobState: await job.getState() })
  }
})

app.post('/api/runquery/', async (req, res) => {
  try {
    const job = await queryGPTQueue.add({
      jobType: 'RUN_QUERY',
      userInput: {query: req.body.query}
    })

    res.json({ jobState: await job.getState(), job})
  } catch(error) {
    console.log(error)
    res.json({error})
  }
})

app.get('/api/runquery/:id', async (req, res) => {
  let id = req.params.id 

  if (id) {
    let job = await queryGPTQueue.getJob(id)
    res.json({ id, job, jobState: await job.getState() })
  }
})


// All remaining requests return the React app, so it can handle routing
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../react-ui/build', 'index.html'))
})

app.listen(PORT, () => {
  console.log(
    `Node ${
      isDev ? 'dev server' : 'cluster worker ' + process.pid
    }: listening on port ${PORT}`
  );
});
  