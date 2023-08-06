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



async function executeQueryGPT(sourceDataExtensionName, targetDataExtensionName, queryDescription) {
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
        sourceDataExtensionFields = [
          {
            Name: 'AccountID',
            Description: 'Your Account ID number',
            FieldType: 'Number',
            IsRequired: 'true'
          },
          {
            Name: 'OYBAccountID',
            Description: 'The account ID number for any related On-Your-Behalf accounts. This field applies to enterprise accounts only',
            FieldType: 'Number',
            IsRequired: 'false',
          },
          {
            Name: 'JobID',
            Description: 'The job ID number for the email send',
            FieldType: 'Number',
            IsRequired: 'true'
          },
          {
            Name: 'ListID',
            Description: 'The list ID number for the list used in the send',
            FieldType: 'Number',
            IsRequired: 'true',
          },
          {
            Name: 'BatchID',
            Description: 'The batch ID number for any batches used in the send',
            FieldType: 'Number',
            IsRequired: 'true',
          },
          {
            Name: 'SubscriberID', 
            Description: 'The subscriber ID for the affected subscriber. This number represents the unique ID for each subscriber record',
            FieldType: 'Number',
            IsRequired: 'true'
          },
          {
            Name: 'SubscriberKey',
            Description: 'The subscriber key for the affected subscriber',
            FieldType: 'Text',
            IsRequired: 'true',
            MaxLength: 254
          },
          {
            Name: 'EventDate',
            Description: 'The date the send took place',
            FieldType: 'Date',
            IsRequired: 'true',
          },
          {
            Name: 'Domain',
            Description: 'The domain at which the send occurred',
            FieldType: 'Text',
            IsRequired: 'true',
            MaxLength: 128
          },
          {
            Name: 'TriggererSendDefinitionObjectID',
            Description: 'The object ID for the triggered send definition',
            FieldType: 'Text',
            IsRequired: 'false',
            MaxLength: 36
          },
          {
            Name: 'TriggeredSendCustomerKey',
            Description: 'The customer key for the triggered send',
            FieldType: 'Text',
            IsRequired: 'false',
            MaxLength: 36
          }
        ]
        break;
      
      case '_open':
        sourceDataExtensionFields = [
          {
            Name: 'AccountID',
            Description: 'Your account ID number',
            FieldType: 'number',
            IsRequired: 'true'
          },
          {
            Name: 'OYBAccountID',
            Description: 'The account ID number for any related On-Your-Behalf accounts. This field applies to enterprise accounts only',
            FieldType: 'Number',
            IsRequired: 'false'
          },
          {
            Name: 'JobID',
            Description: 'The job ID number for the email send',
            FieldType: 'number',
            IsRequired: 'true'
          },
          {
            Name: 'ListID',
            Description: 'The list ID number for the list used in the send',
            FieldType: 'number',
            IsRequired: 'true'
          },
          {
            Name: 'BatchID',
            Description: 'The batch ID number for any batches used in the send',
            FieldType: 'number',
            IsRequired: 'true'
          },
          {
            Name: 'SubscriberID',
            Description: 'The subscriber ID for the affected subscriber. This number represents the unique ID for each subscriber record.',
            FieldType: 'number',
            IsRequired: 'true'
          },
          {
            Name: 'SubscriberKey',
            Description: 'The subscriber key for the affected subscriber',
            FieldType: 'text',
            IsRequired: 'true',
            MaxLength: 254
          },
          {
            Name: 'EventDate',
            Description: 'The date the open took place',
            FieldType: 'date',
            IsRequired: 'true'
          },
          {
            Name: 'Domain',
            Description: 'The domain at which the open occurred',
            FieldType: 'Text',
            IsRequired: 'true',
            MaxLength: 128
          },
          {
            Name: 'IsUnique',
            Description: 'Whether the event is unique or repeated',
            FieldType: 'boolean',
            IsRequired: 'false',
          },
          {
            Name: 'TriggererSendDefinitionObjectID',
            Description: 'The object ID for the triggered send definition',
            FieldType: 'text',
            IsRequired: 'false',
            MaxLength: 36
          },
          {
            Name: 'TriggeredSendCustomerKey',
            Description: 'The customer key for the triggered send',
            FieldType: 'text',
            IsRequired: 'false',
            MaxLength: 36
          },
        ]
        break;
      
      case '_complaint':
        sourceDataExtensionFields = [
          {
            Name: 'AccountID',
            Description: 'Your account ID number',
            FieldType: 'Number',
            IsRequired: 'true'
          },
          {
            Name: 'OYBAccountID',
            Description: 'The account ID number for any related On-Your-Behalf (OYB) accounts. This field applies to enterprise accounts only.',
            FieldType: 'Number',
            IsRequired: 'false'
          },
          {
            Name: 'JobID',
            Description: 'The job ID number for the email send',
            FieldType: 'Number',
            IsRequired: 'true'
          },
          {
            Name: 'ListID',
            Description: 'The list ID number for the list used in the send',
            FieldType: 'Number',
            IsRequired: 'true'
          },
          {
            Name: 'BatchID',
            Description: 'The batch ID number for any batches used in the send',
            FieldType: 'Number',
            IsRequired: 'true'
          },
          {
            Name: 'SubscriberID',
            Description: 'The subscriber ID for the affected subscriber. This number represents the unique ID for each subscriber record.',
            FieldType: 'Number',
            IsRequired: 'true'
          },
          {
            Name: 'SubscriberKey',
            Description: 'The subscriber key for the affected subscriber',
            FieldType: 'Text',
            IsRequired: 'true',
            MaxLength: 254
          },
          {
            Name: 'EventDate',
            Description: 'The date the complaint took place',
            FieldType: 'Date',
            IsRequired: 'true',
          },
          {
            Name: 'IsUnique',
            Description: 'Whether the event is unique or repeated',
            FieldType: 'boolean',
            IsRequired: 'true',
          },
          {
            Name: 'Domain',
            Description: 'The domain at which the complaint occurred',
            FieldType: 'Text',
            IsRequired: 'true',
          },
        ]
        break;
      
      case '_bounce':
        sourceDataExtensionFields = [
          {
            Name: 'AccountID',
            Description: 'Your account ID number',
            FieldType: 'number',
            IsRequired: 'true'
          },
          {
            Name: 'OYBAccountID',
            Description: 'The account ID number for any related On-Your-Behalf accounts. This field applies to enterprise accounts only.',
            FieldType: 'number',
            IsRequired: 'false'
          },
          {
            Name: 'JobID',
            Description: 'The job ID number for the email send',
            FieldType: 'number',
            IsRequired: 'true'
          },
          {
            Name: 'ListID',
            Description: 'The list ID number for the list used in the send',
            FieldType: 'number',
            IsRequired: 'true'
          },
          {
            Name: 'BatchID',
            Description: 'The batch ID number for any batches used in the send',
            FieldType: 'number',
            IsRequired: 'true'
          },
          {
            Name: 'SubscriberID',
            Description: 'The subscriber ID for the affected subscriber. This number represents the unique ID for each subscriber record.',
            FieldType: 'number',
            IsRequired: 'true'
          },
          {
            Name: 'SubscriberKey',
            Description: 'The subscriber key for the affected subscriber. This serves as the primary key.',
            FieldType: 'text',
            IsRequired: 'true',
            MaxLength: 254
          },
          {
            Name: 'EventDate',
            Description: 'The date the bounce took place',
            FieldType: 'Date',
            IsRequired: 'true',
          },
          {
            Name: 'IsUnique',
            Description: 'Whether the event is unique or repeated',
            FieldType: 'Boolean',
            IsRequired: 'true',
          },
          {
            Name: 'Domain',
            Description: 'The domain at which the bounce occurred',
            FieldType: 'Text',
            IsRequired: 'true',
            MaxLength: 128
          },
          {
            Name: 'BounceCategoryID',
            Description: 'The ID number for the bounce category',
            FieldType: 'Number',
            IsRequired: 'true',
          },
          {
            Name: 'BounceCategory',
            Description: 'The category of the bounce',
            FieldType: 'Text',
            IsRequired: 'false',
            MaxLength: 50
          },
          {
            Name: 'BounceSubcategoryID',
            Description: 'The ID number for the bounce subcategory',
            FieldType: 'Number',
            IsRequired: 'false',
          },
          {
            Name: 'BounceSubcategory',
            Description: 'The subcategory of the bounce',
            FieldType: 'Text',
            IsRequired: 'false',
            MaxLength: 50
          },
          {
            Name: 'BounceTypeID',
            Description: 'The ID number for the bounce type',
            FieldType: 'Number',
            IsRequired: 'true',
          },
          {
            Name: 'BounceType',
            Description: 'The type of bounce that occurred',
            FieldType: 'text',
            IsRequired: 'false',
            MaxLength: 50
          },
          {
            Name: 'SMTPBounceReason',
            Description: 'The reason for the bounce relayed by the mail system',
            FieldType: 'text',
            IsRequired: 'false',
            MaxLength: 4000
          },
          {
            Name: 'SMTPBounceReason',
            Description: 'The reason for the bounce relayed by the mail system',
            FieldType: 'text',
            IsRequired: 'false',
            MaxLength: 4000
          },
          {
            Name: 'SMTPMessage',
            Description: 'The message regarding the bounce from the mail system',
            FieldType: 'text',
            IsRequired: 'false',
            MaxLength: 4000
          },
          {
            Name: 'SMTPCode',
            Description: 'The error code for the bounce from the mail system',
            FieldType: 'number',
            IsRequired: 'false',
          },
          {
            Name: 'TriggererSendDefinitionObjectID',
            Description: 'The object ID for the triggered send definition',
            FieldType: 'text',
            IsRequired: 'false',
            MaxLength: 36
          },
          {
            Name: 'TriggeredSendCustomerKey',
            Description: 'The customer key for the triggered send',
            FieldType: 'text',
            IsRequired: 'false',
            MaxLength: 36
          },
          {
            Name: 'IsFalseBounce',
            Description: 'Indicates a false bounce',
            FieldType: 'boolean',
            IsRequired: 'false',
          },
        ]
        break;
      
      case '_job':
        sourceDataExtensionName = [
          {
            Name: ''
          }
        ]
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
    let queryGPTSystemMessage = "Your name is queryGPT and your primary function is to create SQL queries for Salesforce Marketing Cloud Users. You will be provided with the following items and it is your job is to output only the SQL query: 1. Source Target Data Extension name and fields in an array of objects format 2. Target Data Extension name and fields in an array of objects format 3. User input that explains the description of the SQL query that needs to be built. You must use SELECT statements only. Do not use asterisks to grab all fields and instead specify the field names individually."
    let formattedUserMessage = `My source data extension is ${JSON.stringify(sourceDataExtensionName)}. The following is an array of objects representing the the source data extensions fields as well as any additional metadata needed ${JSON.stringify(sourceDataExtensionFields)}. The field names are stored in the "name" property. The field lengths are stored in "MaxLength". If the field is required then "IsRequired" will equal true. If the field is a primary key then "IsPrimaryKey" will equal true and should be included in the query. My target data extension is ${JSON.stringify(targetDataExtensionName)}. The following is an array of objects representing the source data extensions fields as well as any additional metadata needed ${JSON.stringify(targetDataExtensionFields)}. Again, the field names are stored in the "name" property. Make sure to adhere to all of Salesforce Marketing Cloud query limitations and considerations. Take the following query description and only output SQL code: ${JSON.stringify(queryDescription)}. At the beginning of the query, add a helpful query description surrounded by multiline comment syntax (i.e. /* comment */)`
    console.log(formattedUserMessage)

    let exampleUserMessage = `My source data extension is "HashedEmails". The following is an array of objects representing the the source data extensions fields as well as any additional metadata needed [{"PartnerKey":"","ObjectID":"","Name":"UniqueId","MaxLength":"50","IsRequired":"true","IsPrimaryKey":"true","FieldType":"Text"},{"PartnerKey":"","ObjectID":"","Name":"hashedEmail","MaxLength":"50","IsRequired":"true","IsPrimaryKey":"false","FieldType":"Text"}]. The field names are stored in the "name" property. The field lengths are stored in "MaxLength". If the field is required then "IsRequired" will equal true. If the field is a primary key then "IsPrimaryKey" will equal true and should be included in the query. My target data extension is "ContactsandLeads". The following is an array of objects representing the source data extensions fields as well as any additional metadata needed [{"PartnerKey":"","ObjectID":"","Name":"hashedEmail","IsRequired":"false","IsPrimaryKey":"false","FieldType":"Text"},{"PartnerKey":"","ObjectID":"","Name":"Object","MaxLength":"50","IsRequired":"false","IsPrimaryKey":"false","FieldType":"Text"},{"PartnerKey":"","ObjectID":"","Name":"RelatedLeadID","MaxLength":"50","IsRequired":"false","IsPrimaryKey":"false","FieldType":"Text"},{"PartnerKey":"","ObjectID":"","Name":"Name","MaxLength":"50","IsRequired":"false","IsPrimaryKey":"false","FieldType":"Text"},{"PartnerKey":"","ObjectID":"","Name":"UniqueId","MaxLength":"50","IsRequired":"true","IsPrimaryKey":"true","FieldType":"Text"}]. Again, the field names are stored in the "name" property. Make sure to adhere to all of Salesforce Marketing Cloud query limitations and considerations. Take the following query description and only output SQL code: "I want to update records in ContactsandLeads with the hashedemail values in hashedemails data extension"`
    let exampleAssistantMessage = `/* Query Description: This query will update all records in ContactsandLeads Data Extension with hashedemail values from the HashedEmails data extension */ \n \n SELECT \n cl.UniqueId, \n he.hashedEmail \n FROM ContactsandLeads AS cl \n INNER JOIN HashedEmails AS he ON cl.UniqueId = he.UniqueId  `
    
    const chatCompletion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo-0613",
      messages: [
        { role: "system", content: queryGPTSystemMessage },
        { role: "user", name: "example_user", content: exampleUserMessage},
        { role: "assistant", name: "example_assistant", content: exampleAssistantMessage},
        { role: "user", name: "example_user", content: "Awesome job! I'm going to give you details for another query I want you to write"},
        { role: "user", content: formattedUserMessage },
      ],
      temperature: 0.2,
      top_p: 0.1
    });
    console.log(chatCompletion.data.choices[0].message.content)
    return chatCompletion.data.choices[0].message.content
  } catch (error) {
    if (error.response) {
      console.log(error.response.status);
      console.log(error.response.data);
    } else {
      console.log(error.message);
    }
  }
}

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
  
module.exports = {
  executeQueryGPT
}