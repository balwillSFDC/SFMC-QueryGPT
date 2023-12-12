const dotenv = require('dotenv').config();
const stack = process.env.REACT_APP_SFMC_STACK;
const origin = process.env.REACT_APP_SFMC_ORIGIN;
const authOrigin = process.env.REACT_APP_SFMC_AUTHORIGIN;
const soapOrigin = process.env.REACT_APP_SFMC_SOAPORIGIN;
const redirectUri = process.env.REACT_APP_REDIRECTURI
const OPENAI_API_KEY = process.env.OPENAI_API_KEY
const encodedRedirectUri = encodeURIComponent(redirectUri)
var FuelSoap = require('fuel-soap');
const ET_Client = require('sfmc-fuelsdk-node');
const axios = require('axios')
const { Configuration, OpenAIApi } = require("openai")
const dataViewFields = require('./dataViewFields');
const serverAppFlag = process.env.SERVER_APP_FLAG
const qs = require('qs');
const SFDC_URL = process.env.SFDC_URL
const SFDC_CLIENTID = process.env.SFDC_CLIENTID
const SFDC_CLIENTSECRET = process.env.SFDC_CLIENTSECRET
const sqlParser = require('node-sqlparser');
const configuration = new Configuration({
  apiKey: OPENAI_API_KEY
})

let sfdcAccessTokenCache = {
  accessToken: '',
  issuedAt: ''
}

// Instantiating OpenAI API
const openai = new OpenAIApi(configuration);

if (serverAppFlag) {
  const clientId = process.env.REACT_APP_SFMC_CLIENTID_SERVER;
  const clientSecret = process.env.REACT_APP_SFMC_CLIENTSECRET_SERVER;

  sfmcNode = new ET_Client(clientId, clientSecret, stack, {
    origin,
    authOrigin,
    soapOrigin,
    authOptions: {
      authVersion: 2,
      applicationType: 'server',
    }
  });

  console.log('sdk initialized - server-to-server')
} else {
  let sfmcNode = null 
}

// Instantiating Node Class for SFMC
async function initializeSDK(authCode) {
  // WEB APP IMPLEMENTATION  
  if (authCode && !serverAppFlag) {
    const clientId = process.env.REACT_APP_SFMC_CLIENTID_PUBLIC;

    sfmcNode = new ET_Client(clientId, '', stack, {
      origin,
      authOrigin,
      soapOrigin,
      authOptions: {
        authVersion: 2,
        applicationType: 'public',
        redirectURI: redirectUri,
        authorizationCode: authCode
      }
    });

    let tokens  = await sfmcNode.FuelAuthClient._requestToken()

    sfmcNode.FuelAuthClient.refreshToken = tokens.refresh_token
    sfmcNode.FuelAuthClient.accessToken = tokens.access_token
    sfmcNode.FuelAuthClient.restUrl = tokens.rest_instance_url
    sfmcNode.FuelAuthClient.soapUrl = tokens.soap_instance_url 

    sfmcNode.SoapClient.AuthClient = sfmcNode.FuelAuthClient
    // console.log(sfmcNode.SoapClient)
    console.log('sdk initialized - Public')
  } 
  // SERVER SIDE IMPLEMENTATION
  else if (serverAppFlag) {
    const clientId = process.env.REACT_APP_SFMC_CLIENTID_SERVER;
    const clientSecret = process.env.REACT_APP_SFMC_CLIENTSECRET_SERVER;


    sfmcNode = new ET_Client(clientId, clientSecret, stack, {
      origin,
      authOrigin,
      soapOrigin,
      authOptions: {
        authVersion: 2,
        applicationType: 'server',
      }
    });

    console.log('sdk initialized - server-to-server')
  }
  console.log('SDK initialized:', sfmcNode != null);

}

async function executeQueryGPT(sourceDataExtensionName, targetDataExtensionName, queryDescription) {
  console.log('executing query gpt function')
  // Check if sourceDataExtensionName is provided and is a non-empty string
  if (!sourceDataExtensionName || typeof sourceDataExtensionName !== 'string') {
    throw new Error('Invalid or missing sourceDataExtensionName');
  }

  // Check if queryDescription is provided and is a non-empty string
  if (!queryDescription || typeof queryDescription !== 'string') {
    throw new Error('Invalid or missing queryDescription');
  }

  // target data extension is optional
  let targetDataExtensionFields
  if (targetDataExtensionName) {
    targetDataExtensionFields = await retrieveDataExtensionFields(targetDataExtensionName)
  }
  
  let sourceDataExtensionFields
  
  if (sourceDataExtensionName.startsWith("_")) {
    // definitions stored in dataViewFields.js - Too long for this page
    sourceDataExtensionFields = dataViewFields[sourceDataExtensionName]
    
  } else { 
    sourceDataExtensionFields = await retrieveDataExtensionFields(sourceDataExtensionName)
    // console.log(sourceDataExtensionFields)
  }

  if (targetDataExtensionFields === "data extension not found" || sourceDataExtensionFields === "data extension not found") {
    let dataExtensionsNotFound = []
    
    if (sourceDataExtensionFields === 'data extension not found') {
      dataExtensionsNotFound.push(sourceDataExtensionName)
    }
    
    if (targetDataExtensionFields === 'data extension not found') {
      dataExtensionsNotFound.push(targetDataExtensionName)
    }
    
    return {
      status: "failed",
      result: "data extension not found",
      dataExtensionsNotFound
    }
  }

  let sfdc_accessToken = await getSfdcAccessToken()


  let response = await axios({
    method: 'POST',
    url: SFDC_URL + '/services/apexrest/qgpt',
    headers: {'Authorization': `Bearer ${sfdc_accessToken}`, 'Content-Type': 'application/json'},
    data: JSON.stringify({
      "useCase": queryDescription,
      "sourceDataExtension": sourceDataExtensionName,
      "sourceDataExtensionFields": sourceDataExtensionFields
    })
  })


  return {
    status: "success",
    result: response.data.result
  }
  // try {
  //   let queryGPTSystemMessage = "Your name is queryGPT and your primary function is to create SQL queries for Salesforce Marketing Cloud Users. You will be provided with the following items and it is your job is to output only the SQL query: 1. Source Target Data Extension name and fields in an array of objects format 2. Target Data Extension name and fields in an array of objects format 3. User input that explains the description of the SQL query that needs to be built. You must use SELECT statements only. Do not use asterisks to grab all fields and instead specify the field names individually. If you are provided a query description that does not clearly result in you returning a SQL query, ask the user to clarify and explain what you need them to clarify."
    
  //   let formattedUserMessage = `My source data extension is ${JSON.stringify(sourceDataExtensionName)}. The following is an array of objects representing the the source data extensions fields as well as any additional metadata needed ${JSON.stringify(sourceDataExtensionFields)}. The field names are stored in the "name" property. The field lengths are stored in "MaxLength". If the field is required then "IsRequired" will equal true. If the field is a primary key then "IsPrimaryKey" will equal true and should be included in the query. ${!targetDataExtensionName ? '' : `My target data extension is ${JSON.stringify(targetDataExtensionName)}`}. The following is an array of objects representing the source data extensions fields as well as any additional metadata needed ${JSON.stringify(targetDataExtensionFields)}.}  Again, the field names are stored in the "name" property. Make sure to adhere to all of Salesforce Marketing Cloud query limitations and considerations. Take the following query description and only output SQL code: ${JSON.stringify(queryDescription)}.`

    
  //   let exampleUserMessage_1 = `My source data extension is "HashedEmails". The following is an array of objects representing the the source data extensions fields as well as any additional metadata needed [{"PartnerKey":"","ObjectID":"","Name":"UniqueId","MaxLength":"50","IsRequired":"true","IsPrimaryKey":"true","FieldType":"Text"},{"PartnerKey":"","ObjectID":"","Name":"hashedEmail","MaxLength":"50","IsRequired":"true","IsPrimaryKey":"false","FieldType":"Text"}]. The field names are stored in the "name" property. The field lengths are stored in "MaxLength". If the field is required then "IsRequired" will equal true. If the field is a primary key then "IsPrimaryKey" will equal true and should be included in the query. My target data extension is "ContactsandLeads". The following is an array of objects representing the source data extensions fields as well as any additional metadata needed [{"PartnerKey":"","ObjectID":"","Name":"hashedEmail","IsRequired":"false","IsPrimaryKey":"false","FieldType":"Text"},{"PartnerKey":"","ObjectID":"","Name":"Object","MaxLength":"50","IsRequired":"false","IsPrimaryKey":"false","FieldType":"Text"},{"PartnerKey":"","ObjectID":"","Name":"RelatedLeadID","MaxLength":"50","IsRequired":"false","IsPrimaryKey":"false","FieldType":"Text"},{"PartnerKey":"","ObjectID":"","Name":"Name","MaxLength":"50","IsRequired":"false","IsPrimaryKey":"false","FieldType":"Text"},{"PartnerKey":"","ObjectID":"","Name":"UniqueId","MaxLength":"50","IsRequired":"true","IsPrimaryKey":"true","FieldType":"Text"}]. Again, the field names are stored in the "name" property. Make sure to adhere to all of Salesforce Marketing Cloud query limitations and considerations. Take the following query description and only output SQL code: "I want to update records in ContactsandLeads with the hashedemail values in hashedemails data extension"`
  //   let exampleAssistantMessage_1 = `SELECT \n \t cl.UniqueId, \n \t he.hashedEmail \n FROM ContactsandLeads AS cl \n \t INNER JOIN HashedEmails AS he ON cl.UniqueId = he.UniqueId`
    
  //   const chatCompletion = await openai.createChatCompletion({
  //     model: "gpt-3.5-turbo",
  //     messages: [
  //       { role: "system", content: queryGPTSystemMessage },
  //       { role: "user", name: "example_user", content: exampleUserMessage_1},
  //       { role: "assistant", name: "example_assistant", content: exampleAssistantMessage_1},
  //       { role: "user", name: "example_user", content: "Awesome job! I'm going to give you details for another query I want you to write"},
  //       { role: "user", content: formattedUserMessage },
  //     ],
  //     temperature: 0.2,
  //     top_p: 0.1
  //   });
  //   return {
  //     status: "success",
  //     result: chatCompletion.data.choices[0].message.content
  //   }
  // } catch (error) {
  //   if (error.response) {
  //     console.log(error)
  //     console.log(error.response.status);
  //     console.log(error.response.data);
  //   } else {
  //     console.log(error.message);
  //   }
  // }
}

async function getSfdcAccessToken() {
  let nowMinusTwoHours = new Date().setHours(new Date().getHours() - 2)
  let issuedAt = new Date(sfdcAccessTokenCache.issuedAt)
  // if we have sfdc access token and it hasn't expired, return it
  if (sfdcAccessTokenCache.accessToken && sfdcAccessTokenCache.issuedAt > nowMinusTwoHours) {
    return sfdcAccessTokenCache.accessToken
  }

  let data = qs.stringify({
    'grant_type': 'client_credentials',
    'client_id': SFDC_CLIENTID,
    'client_secret': SFDC_CLIENTSECRET 
  });

  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: SFDC_URL + '/services/oauth2/token',
    headers: { 
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data : data
  };

  let response = await axios.request(config)
  
  sfdcAccessTokenCache.accessToken = response.data.access_token
  sfdcAccessTokenCache.issuedAt = response.data.issued_at

  return response.data.access_token
}


async function retrieveDataExtensionCustomerKey(dataExtensionName) {
  console.log(`retrieveDataExtensionCustomerKey(${dataExtensionName})`)
  let props = [
    'DataExtension.CustomerKey',
    'DataExtension.Name'
  ];

  let filter = {
    filter: {
      leftOperand: "Name",
      operator: "equals",
      rightOperand: dataExtensionName
    }
  };
  
  return new Promise((resolve, reject) => {
    sfmcNode.SoapClient.retrieve('dataextension', props, filter, (err, response) => {
      if (err) {
        console.log('retrieveDataExtensionCustomerKey() failed')
        reject(err);
      } else {
        if (response.body.Results.length === 0) {
          resolve('data extension not found')
        } else {
          resolve(response.body.Results[0].CustomerKey);
        }
      }
    });
  });
}


  // Returns array of data extension fields
  // sample
  //   
  // [{
  //   PartnerKey: '',
  //   ObjectID: '',
  //   Name: 'UniqueId',
  //   MaxLength: '50',
  //   IsRequired: 'true',
  //   IsPrimaryKey: 'true',
  //   FieldType: 'Text'
  // }]
async function retrieveDataExtensionFields(dataExtensionName) {
  console.log(`retrieveDataExtensionFields(${dataExtensionName})`)
  const customerKey = await retrieveDataExtensionCustomerKey(dataExtensionName);

  if (customerKey === 'data extension not found') {
    return 'data extension not found'
  }

  let props = [
    'DataExtensionField.Name',
    'DataExtensionField.MaxLength',
    'DataExtensionField.IsRequired',
    'DataExtensionField.IsPrimaryKey',
    'DataExtensionField.FieldType',

  ];

  let filter = {
    filter: {
      leftOperand: "DataExtension.CustomerKey",
      operator: "equals",
      rightOperand: customerKey
    }
  };

  return new Promise((resolve, reject) => {
    sfmcNode.SoapClient.retrieve('dataextensionfield', props, filter, (err, response) => {
      if (err) {
        reject(err);
      } else {
        resolve(response.body.Results);
      }
    });
  });
}


async function createDataExtension(dataExtensionOptions) {
  let de = sfmcNode.dataExtension(dataExtensionOptions)

  return new Promise((resolve, reject) => {
    de.post((err, response) => {
      if (err) {
        reject(err);
      } else {
        resolve(response.body.Results);
      }
    })
    
  });
}

async function createQuery(queryOptions) {
  return new Promise((resolve, reject) => {
    sfmcNode.SoapClient.create('QueryDefinition', queryOptions, (err, response) => {
      if (err) {
        console.error(err);
        reject(err)
      } else {
        console.log('Query Activity created with Query GPT');
        resolve(response.body.Results[0])
      }
    });
  })
}

async function startQuery(ObjectID) {
  let queryOptions = {ObjectID}
  return new Promise((resolve, reject) => {
    sfmcNode.SoapClient.perform('QueryDefinition', queryOptions, (err, response) => {
      if (err) {
        console.error(err)
        reject(err)
      } else {
        console.log('Query Activity started');
        resolve(response.body.Results[0])
      }
    })
  })
}

async function checkStatusOfQuery(taskId) {
  let props = [
    'Status',
    'StartTime',
    'EndTime',
    'TaskID',
    'Program',
    'Type',
    'ErrorMsg',
    'StatusMessage'
  ];

  let filter = {
    filter: {
      leftOperand: "TaskID",
      operator: "equals",
      rightOperand: taskId
    }
  };

  const check = async () => {
    return new Promise((resolve, reject) => {
      sfmcNode.SoapClient.retrieve('AsyncActivityStatus', props, filter, (err, response) => {
        if (err) {
          console.error(err);
          reject(err);
        } else {
          let parsedResponse = {}  
          response.body.Results[0].Properties.Property.forEach(nameValuePair => {
            parsedResponse[nameValuePair.Name] = nameValuePair.Value
          })
          if (parsedResponse.Status === 'Complete' || parsedResponse.Status === 'FatalError') {
            resolve(parsedResponse);
          } else {
            setTimeout(() => resolve(check()), 1000); // Check again after 1 second
          }
        }
      });
    });
  };

  return check();
}


async function getAllDataExtensionRecords(deName, fields) {
  let dataExtensionRecords = {
    Name: deName,
    props: fields
  }
  console.log(dataExtensionRecords)

  let rows = sfmcNode.dataExtensionRow(dataExtensionRecords)
  return new Promise((resolve, reject) => {
    rows.get((err, response) => {
      if (err) {
        reject(err)
      } else {
        resolve(response.body)
      }
    })
  })
}

/**
 * Output name in following format '[OBJECT]-[EPOCH] 
 * @param {} objectType 
 */
function createAssetName(objectType) {
  let epoch = new Date().valueOf()

  return `QGPT-${objectType}-${epoch}`
}


function createDeFieldsFromQuery(query) {
  try {
    let parsedQuery = sqlParser.parse(query)
    if (parsedQuery && parsedQuery.type === 'select') {
      let outputFields = parsedQuery.columns.map(column => column.expr.column)

      let deFields = outputFields.map(field => (
        {
          Name: field,
          FieldType: 'Text',
          MaxLength: '500',
          IsRequired: false,
          IsPrimaryKey: false
        }
      ))

      return deFields
    }
  } catch(e) {
    console.log(e)
  }
}

  
async function runQuery(query, targetDataExtensionName) {
  let now = new Date().toISOString()

  // Create DE based on query output fields 
  let newDeFields = createDeFieldsFromQuery(query)
  let newDeName = createAssetName('DE')

  let newDeOptions = {
    props: {
      Name: newDeName,
      CustomerKey: newDeName,
      Description: `Data Extension created by QGPT on ${now}`,    
      DataRetentionPeriodLength: 1,
      DataRetentionPeriodUnitOfMeasure: 3, // No idea why 3 = "days" for unit of measure but whatever...
      // DeleteAtEndOfRetentionPeriod: 'true'
    },
    columns: newDeFields
  }

  let newDe = await createDataExtension(newDeOptions)

  let newQueryname = createAssetName('Query') 
  // create query activity 
  const queryActivity = {
    Name: newQueryname,
    Description: `Created from QGPT`,
    CustomerKey: newQueryname,
    QueryText: query,
    DataExtensionTarget: {
      CustomerKey: newDeName
    },
    TargetType: "DE",
    TargetUpdateType: "Overwrite"
  };

  try {
    let createQueryResult = await createQuery(queryActivity)
    let createQueryObjectId = createQueryResult.NewObjectID
    let startQueryResult = await startQuery(createQueryObjectId)  
    let queryTaskId = startQueryResult.Result.Task.ID
    let finalQueryStatus = await checkStatusOfQuery(queryTaskId)
    if (finalQueryStatus.Status == 'Complete') {
      try {
        let results = await getAllDataExtensionRecords(newDeName, newDeFields.map(field => field.Name))
        let parsedResults = results.Results.map(record => {
          // record is an array 
          let transformedRow = {}

          record.Properties.Property.forEach(column => transformedRow[column.Name] = column.Value)
          return transformedRow
        })
        console.log(parsedResults) 
        return parsedResults

      } catch(e) {
        console.log(e)
      }
    }
  } catch(e) {
    console.log(e)
  }
}


module.exports = {
  initializeSDK,
  executeQueryGPT,
  getSfdcAccessToken,
  runQuery
}