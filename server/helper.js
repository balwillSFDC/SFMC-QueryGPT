const dotenv = require('dotenv').config();
const clientId = process.env.REACT_APP_SFMC_CLIENTID;
const clientSecret = process.env.REACT_APP_SFMC_CLIENTSECRET;
const stack = process.env.REACT_APP_SFMC_STACK;
const origin = process.env.REACT_APP_SFMC_ORIGIN;
const authOrigin = process.env.REACT_APP_SFMC_AUTHORIGIN;
const soapOrigin = process.env.REACT_APP_SFMC_SOAPORIGIN;
const redirectUri = process.env.REACT_APP_REDIRECTURI
const encodedRedirectUri = encodeURIComponent(redirectUri)
var FuelSoap = require('fuel-soap');
const ET_Client = require('sfmc-fuelsdk-node');
const axios = require('axios')
const { Configuration, OpenAIApi } = require("openai")

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
})

const openai = new OpenAIApi(configuration);



let sourceDataExtensionName = "HashedEmails"
let sourceDataExtensionFields = [
  {
    PartnerKey: '',
    ObjectID: '',
    Name: 'UniqueId',
    MaxLength: '50',
    IsRequired: 'true',
    IsPrimaryKey: 'true',
    FieldType: 'Text'
  },
  {
    PartnerKey: '',
    ObjectID: '',
    Name: 'hashedEmail',
    MaxLength: '50',
    IsRequired: 'true',
    IsPrimaryKey: 'false',
    FieldType: 'Text'
  }
]
let targetDataExtensionName = "ContactsAndLeads"
let targetDataExtensionFields = [
  {
    PartnerKey: '',
    ObjectID: '',
    Name: 'hashedEmail',
    IsRequired: 'false',
    IsPrimaryKey: 'false',
    FieldType: 'Text'
  },
  {
    PartnerKey: '',
    ObjectID: '',
    Name: 'Object',
    MaxLength: '50',
    IsRequired: 'false',
    IsPrimaryKey: 'false',
    FieldType: 'Text'
  },
  {
    PartnerKey: '',
    ObjectID: '',
    Name: 'RelatedLeadID',
    MaxLength: '50',
    IsRequired: 'false',
    IsPrimaryKey: 'false',
    FieldType: 'Text'
  },
  {
    PartnerKey: '',
    ObjectID: '',
    Name: 'Name',
    MaxLength: '50',
    IsRequired: 'false',
    IsPrimaryKey: 'false',
    FieldType: 'Text'
  },
  {
    PartnerKey: '',
    ObjectID: '',
    Name: 'UniqueId',
    MaxLength: '50',
    IsRequired: 'true',
    IsPrimaryKey: 'true',
    FieldType: 'Text'
  }
]
queryDescription = "HashedEmails data extension contains the hashedEmails values that I want to use to update records in the ContactsAndLeads data extension. Use the UniqueId field to connect the two data extensions"

async function queryBuilder(sourceDataExtensionName, sourceDataExtensionFields, targetDataExtensionName, targetDataExtensionFields, queryDescription) {

  try {
    const chatCompletion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "Your name is QueryBuilder and your primary function is to create SQL queries for Salesforce Marketing Cloud Users. You will be provided with the following items and it is your job is to output only the SQL query: 1. Source Target Data Extension name and fields in an array of objects format 2. Target Data Extension name and fields in an array of objects format 3. User input that explains the description of the SQL query that needs to be built. You must use SELECT statements only. Do not use asterisks and instead specify the field names" },
        { role: "user", content: `My source data extension is ${sourceDataExtensionName}. The following is an array of objects representing the the source data extensions fields as well as any additional metadata needed ${sourceDataExtensionFields}. The field names are stored in the "name" property. My target data extension is ${targetDataExtensionName}. The following is an array of objects representing the source data extensions fields as well as any additional metadata needed ${targetDataExtensionFields}. Again, the field names are stored in the "name" property. Please take the following query description and only output SQL code: ${queryDescription}` },
      ],
    });
    console.log(chatCompletion.data.choices[0].message);
  } catch (error) {
    console.error('Error:', error);
  }
}


// queryBuilder(sourceDataExtensionName, sourceDataExtensionFields, targetDataExtensionName, targetDataExtensionFields, queryDescription)


// Instantiating Node Class
const sfmcNode = new ET_Client(clientId, clientSecret, stack, {
  origin,
  authOrigin,
  soapOrigin,
  authOptions: {
    authVersion: 2,
    applicationType: 'server'
  }
});



async function retrieveDataExtensionCustomerKey(dataExtensionName) {
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
        reject(err);
      } else {
        resolve(response.body.Results[0].CustomerKey);
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
  let customerKey = await retrieveDataExtensionCustomerKey(dataExtensionName);

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
  