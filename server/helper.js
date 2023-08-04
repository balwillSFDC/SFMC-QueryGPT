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

// Instantiating OpenAI API
const openai = new OpenAIApi(configuration);

// Instantiating Node Class for SFMC
const sfmcNode = new ET_Client(clientId, clientSecret, stack, {
  origin,
  authOrigin,
  soapOrigin,
  authOptions: {
    authVersion: 2,
    applicationType: 'server'
  }
});



async function executeQueryBuilder(sourceDataExtensionName, targetDataExtensionName, queryDescription) {
  let targetDataExtensionFields = await retrieveDataExtensionFields(targetDataExtensionName)

  let sourceDataExtensionFields

  if (sourceDataExtensionName.startsWith("_")) {
    switch (sourceDataExtensionName) {
      case '_subscribers':
        sourceDataExtensionFields = [
          {
            Name: 'SubscriberID',
            MaxLength: '50',
            IsRequired: 'true',
            IsPrimaryKey: 'true',
            FieldType: 'Text'
          },
          {
            Name: 'DateUndeliverable',
            MaxLength: '',
            IsRequired: 'false',
            IsPrimaryKey: 'false',
            FieldType: 'Date'
          },
          {
            Name: 'DateJoined',
            MaxLength: '',
            IsRequired: 'true',
            IsPrimaryKey: 'false',
            FieldType: 'Date'
          },
          {
            Name: 'DateUnsubscribed',
            MaxLength: '',
            IsRequired: 'false',
            IsPrimaryKey: 'false',
            FieldType: 'Date'
          },
          {
            Name: 'Domain',
            MaxLength: '50',
            IsRequired: 'true',
            IsPrimaryKey: 'false',
            FieldType: 'Text'
          },
          {
            Name: 'EmailAddress',
            MaxLength: '255',
            IsRequired: 'true',
            IsPrimaryKey: 'false',
            FieldType: 'Email'
          },
          {
            Name: 'BounceCount',
            MaxLength: '3',
            IsRequired: 'false',
            IsPrimaryKey: 'false',
            FieldType: 'Number'
          },
          {
            Name: 'SubscriberKey',
            MaxLength: '255',
            IsRequired: 'true',
            IsPrimaryKey: 'true',
            FieldType: 'text'
          },
          {
            Name: 'SubscriberType',
            MaxLength: '50',
            IsRequired: 'true',
            IsPrimaryKey: 'false',
            FieldType: 'text'
          },
          {
            Name: 'Status',
            MaxLength: '50',
            IsRequired: 'true',
            IsPrimaryKey: 'false',
            FieldType: 'text'
          },
          {
            Name: 'Locale',
            MaxLength: '50',
            IsRequired: 'false',
            IsPrimaryKey: 'false',
            FieldType: 'text'
          },
        ]
        break;
      
      case '_sent':
        break;
      
      case '_open':
        break;
      
      case '_complaint':
        break;
      
      case '_bounce':
        break;
      
      case '_job':
        break;
      
      case '_click':
        break;
      
      case '_unsubscribe':
        break;
      
    }
  } else { 
    sourceDataExtensionFields = await retrieveDataExtensionFields(sourceDataExtensionName)
  }

  try {
    const chatCompletion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "Your name is QueryBuilder and your primary function is to create SQL queries for Salesforce Marketing Cloud Users. You will be provided with the following items and it is your job is to output only the SQL query: 1. Source Target Data Extension name and fields in an array of objects format 2. Target Data Extension name and fields in an array of objects format 3. User input that explains the description of the SQL query that needs to be built. You must use SELECT statements only. Do not use asterisks and instead specify the field names." },
        { role: "user", content: `My source data extension is ${JSON.stringify(sourceDataExtensionName)}. The following is an array of objects representing the the source data extensions fields as well as any additional metadata needed ${JSON.stringify(sourceDataExtensionFields)}. The field names are stored in the "name" property. My target data extension is ${JSON.stringify(targetDataExtensionName)}. The following is an array of objects representing the source data extensions fields as well as any additional metadata needed ${JSON.stringify(targetDataExtensionFields)}. Again, the field names are stored in the "name" property. Take the following query description and only output SQL code: ${JSON.stringify(queryDescription)}` },
      ],
    });
    console.log(chatCompletion.data.choices[0].message.content);
  } catch (error) {
    console.error('Error:', error);
  }
}

let sourceDataExtensionName = "_subscribers"
let targetDataExtensionName = "ContactsAndLeads"
queryDescription = "I want to pull a list of all subscribers who have joined in the last year. SubscriberKey should go in the UniqueId field. If SubscriberKey starts with '003', the Object field should equal 'lead' if it starts with '00q' it should be 'contact'"
executeQueryBuilder(sourceDataExtensionName, targetDataExtensionName, queryDescription)

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
  
