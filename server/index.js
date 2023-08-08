const express             = require('express')
const path                = require('path')
const numCPUs             = require('os').cpus().length
const { readFileSync }    = require('fs')
const axios               = require('axios')
const env                 = require('dotenv').config()
const bodyParser          = require('body-parser')
const clientId            = process.env.REACT_APP_SFMC_CLIENTID;
const clientSecret        = process.env.REACT_APP_SFMC_CLIENTSECRET;
const stack               = process.env.REACT_APP_SFMC_STACK;
const origin              = process.env.REACT_APP_SFMC_ORIGIN;
const authOrigin          = process.env.REACT_APP_SFMC_AUTHORIGIN;
const soapOrigin          = process.env.REACT_APP_SFMC_SOAPORIGIN;
const redirectUri         = process.env.REACT_APP_REDIRECTURI
const encodedRedirectUri  = encodeURIComponent(redirectUri)
let Queue = require('bull');
let REDIS_URL = process.env.REDIS_URL || 'redis://127.0.0.1:6379';
const cors = require('cors')

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

// Get Auth Code
// for web app
app.get('/api/authcode', (req, res) => {    
  axios({
    url: `${authOrigin}/v2/authorize?response_type=code&client_id=${clientId}&redirect_uri=${encodedRedirectUri}`,
    method: 'GET'
  })
    .then(response => {
      res.json(response.request.res.responseUrl)
    })
    .catch(error => console.log(error))
})

// Get Access Token
app.post('/api/accesstoken', (req, res) => {
  
  let body = {
    grant_type: 'authorization_code',
    code: req.body.code,
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: redirectUri,
    scope: 'offline'
  }

  axios({
    url: `${authOrigin}/v2/token`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    data: JSON.stringify(body)
  })
    .then(response => {
      res.send(response.data)
    })
    .catch(error => console.log(error.response))
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
  