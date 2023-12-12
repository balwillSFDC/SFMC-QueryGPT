module.exports = {
    _subscribers: [
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
    ],
    _sent: [
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
    ],
    _open: [
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
    ],
    _complaint:  [
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
    ],
    _bounce: [
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
    ],
    _job: [
        {
            Name: ''
        }
    ],
    _click: [

    ],
    _unsubscribe: []

}