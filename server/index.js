const express             = require('express')
const path                = require('path')
const cluster             = require('cluster')
const numCPUs             = require('os').cpus().length
const https               = require('https')
const { readFileSync }    = require('fs')
const axios               = require('axios')
const env                 = require('dotenv').config()
const bodyParser          = require('body-parser')
const helper              = require('./helper.js')
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

const isDev = process.env.NODE_ENV !== 'production'
const PORT = process.env.port || 5000

if (!isDev && cluster.isMaster) {
  console.error(`Node cluster master ${process.pid} is running`)

  for (let i = 0; i < numCPU; i++) {
    cluster.fork()
  }

  cluster.on('exit', (worker,code, signal) => {
    console.error( `node cluster worker ${worker.process.pid} exited: code ${code}, signal ${signal}`)
  })
} else {
  const app = express();
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))
  app.use(bodyParser.json())

  // Priority serve any static files
  app.use(express.static(path.resolve(__dirname, '../react-ui/build')))
  // =======================================================
  // QUEUES
  // =======================================================
  let queryBuilderQueue = new Queue('queryBuilder', REDIS_URL);

  

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


  app.post('/api/querybuilder', async (req, res) => {
    let sourceDataExtensionName = req.body.sourceDataExtensionName
    let targetDataExtensionName = req.body.targetDataExtensionName
    let queryDescription = req.body.queryDescription
    
    let job = await queryBuilderQueue.add({
      jobType: 'EXECUTE_QUERY_BUILDER',
      userInput: {sourceDataExtensionName, targetDataExtensionName, queryDescription}
    })

    res.json({
      id: job.id,
      state: await job.getState()
    })
    


    let queryResult = await helper.executeQueryBuilder(sourceDataExtensionName, targetDataExtensionName, queryDescription)

    res.send({queryResult})
   
  })

  app.get('/api/querybuilder/:id', async (req, res) => {
    
  })

  // All remaining requests return the React app, so it can handle routing
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../react-ui/build', 'index.html'))
  })

  // Creates Server using 'HTTPS' protocol
  // https.createServer({
  //   key: readFileSync('server.key'),
  //   cert: readFileSync('server.cert')
  // }, app).listen(PORT, () => {
  //   console.error(`Node ${isDev ? 'dev server' : 'cluster worker '+process.pid}: listening on port ${PORT}`);
  // })

  app.listen(PORT, () => {
    console.log(
      `Node ${
        isDev ? 'dev server' : 'cluster worker ' + process.pid
      }: listening on port ${PORT}`
    );
  });
  

}