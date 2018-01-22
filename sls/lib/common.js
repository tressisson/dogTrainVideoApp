module.exports = function () {
	
const AWS = require('aws-sdk');
const AWSCognito = require('amazon-cognito-identity-js');
const Promise = require('promise');
const api = require('infusionsoft-api');
const STAGE=process.env.STAGE

var iApp = ""
var iApi = ""
var tagsMap = {}

if (STAGE != 'xrod') {
 iApp = 'zm332'
 iApi = '1eab82ad0239645d1713603dab9fe142'
}
else {
 iApp = 'un105'
 iApi = '65c5b68d91f6e5a48574581b933c9097'
}

const contactsTable = process.env.CONTACTS_TABLE
const projectsTable = process.env.PROJECTS_TABLE
const userPoolId = process.env.USERPOOL_ID
const clientId = process.env.CLIENT_ID

var docClient = new AWS.DynamoDB.DocumentClient({apiVersion: '2012-08-10'});
var infusionsoft = new api.DataContext(iApp,iApi)


this.mapContact = function mapContact(contact,contactType) {
// mapping function for various types of contacts, e.g. crm, dynamoDB, etc
  var newContact = {}
  if (contactType == 'crm') {
    newContact = {
        'Email'          : contact.email.toLowerCase(),
        'FirstName'      : contact.firstname,
        'LastName'       : contact.lastname,
        'Company'        : contact.firm,
        'StreetAddress1' : contact.address, 
        'City'           : contact.city, 
        'State'          : contact.state, 
        'PostalCode'     : contact.zip, 
        'Phone1'         : contact.phone  }
  }
  else if (contactType == 'tags') {
    newContact = {
        'Id'             : contact.id,
        'Email'          : contact.email.toLowerCase(),
        'Tags'           : contact.tags.concat(',EIM 2018') }
  }
  else if (contactType == 'ddb') {
    newContact = {
        'Id'             : contact.id,
        'Email'          : contact.email.toLowerCase(),
        'FirstName'      : contact.firstname,
        'LastName'       : contact.lastname,
        'Firm'           : contact.firm,
        'StreetAddress1' : contact.address, 
        'City'           : contact.city, 
        'State'          : contact.state, 
        'Password'       : contact.password,
        'PostalCode'     : contact.zip, 
        'Phone'          : contact.phone, 
        'Tags'           : contact.tags.concat(',EIM 2018') }
  }
  else if (contactType == 'cognito') {
    newContact = {
        'email'          : contact.email.toLowerCase(),
        'given_name'     : contact.firstname,
        'family_name'    : contact.lastname,
        'phone_number'   : "+1".concat(contact.phone),
        'password'       : contact.password }
  }
  return newContact;
}

this.crmContactCfg = function crmContactCfg(contact) {
  console.log("Cfg: adding tags for",contact)  
  var tagList = contact.Tags.split(',')
  for (let i=0;i<tagList.length;i++) {
    for (let tag in tagsMap) {
      if (tagList[i].indexOf(tag) == 0) {
        console.log("contactId: ",contact.Id,eval('tagsMap["'.concat(tag,'"]')))
        infusionsoft.ContactService.addToGroup(contact.Id,eval('tagsMap["'.concat(tag,'"]')))
          .then(function (result) {
            console.log("Contact tag added: ",result)
            })
        .fail(function(err) {
          console.log('CRM contact tag configuration error: ' + err);      
                            })
      }
    }
  }
  infusionsoft.APIEmailService.optIn(contact.Email,'TrainThroughPlay SignUp')
    .then(function (result) {
      console.log("Contact Email optIn successful: ",result)
      })
    .fail(function(err) {
      console.log('CRM contact email status error: ' + err);      
                            })  
}

this.crmContactGet = function crmContactGet(email) {
  return new Promise((resolve, reject) => {

    var contact = {}
  
    infusionsoft.Contacts
      .where(Contact.Email, email)
      .first()
      .then(function(crmContact) {
        if (crmContact === undefined) {
          contact = {"status": "Not found"}
          resolve(contact)
        }
        else {
          contact = crmContact
          contact.status = "Retrieved"
          contact.Tags = [];
          return infusionsoft.ContactGroupAssigns
                 .where(ContactGroupAssign.ContactId, crmContact.Id)
                 .toArray();
        }
        })
      .then(function(cgas) {
        if (cgas !== undefined) {
          cgas.forEach(function(group) {
            contact.Tags.push(group.ContactGroup);
          })
        }
        resolve(contact);
      }) // end of ContactGroupAssigns get
      .fail(function(err) {
        console.log("ERROR crmContactGet:",err)
      })
  })
}



this.cogSignUp = function cogSignUp(contact) {
  return new Promise((resolve, reject) => {

// If contact has Entrant tag create a user in Cognito so that they can login to the application
//  if (contact.tags.include('Entrant'))
//  console.log(contact)
    var cognitoSettings = {
      UserPoolId: userPoolId,
      ClientId: clientId
    }
    
    var userPool = new AWSCognito.CognitoUserPool(cognitoSettings)  
    
    var attributeList = [
      new AWSCognito.CognitoUserAttribute({ Name: 'given_name', Value: contact.given_name }),
      new AWSCognito.CognitoUserAttribute({ Name: 'family_name', Value: contact.family_name }),
      new AWSCognito.CognitoUserAttribute({ Name: 'email', Value: contact.email }),
      new AWSCognito.CognitoUserAttribute({ Name: 'phone_number', Value: contact.phone_number })
    ]
    userPool.signUp(contact.email, contact.password, attributeList, null, function(err, result){
        if (err) {
          console.log("cogSignUp Error",err);
          resolve(err);
        }
        else {
          console.log("cogSignup Result:",result)
          resolve("cogSignUp successful");
        }
    });
    
  }) // end of promise
}
  
this.ddbGet = function ddbGet(ddbTable, ddbKey, ddbKeyValue) {
  return new Promise((resolve, reject) => {

//  Call DynamoDB to get key metadata
  var ddbParams = {
    ExpressionAttributeValues: { ':ddbKeyValue' : ddbKeyValue },
    KeyConditionExpression:  ddbKey.concat('=:ddbKeyValue'),
    TableName: ddbTable,
  };

  console.log('ddbParams',ddbParams)

  // Call DynamoDB to query the table
  docClient.query(ddbParams, function(err, data) {
    if (err) {
      console.log("Error", err);
      var result = { "Error": err};
      reject();
    } else {
      resolve(data);
    }
  }); //End of docClient query
  }); //End of Promise
}  //End of function

this.ddbIdxGet = function ddbIdxGet(ddbTable, ddbIndex, ddbKey, ddbKeyValue) {
  return new Promise((resolve, reject) => {

//  Call DynamoDB to get key metadata
  var ddbParams = {
    ExpressionAttributeValues: { ':ddbKeyValue' : ddbKeyValue },
    KeyConditionExpression:  ddbKey.concat('=:ddbKeyValue'),
    TableName: ddbTable,
    IndexName: ddbIndex
  };

//  console.log('ddbParams',ddbParams)

  // Call DynamoDB to query the table
  docClient.query(ddbParams, function(err, data) {
    if (err) {
      console.log("Error", err);
      var result = { "Error": err};
      reject();
    } else {
      resolve(data);
    }
  }); //End of docClient query
  }); //End of Promise
}  //End of function

this.ddbPut = function ddbPut(tableName, item) {
  return new Promise((resolve, reject) => {

//  Call DynamoDB to save item data in tableName
  var ddbParams = {
      TableName: tableName,
      Item: item
    };

  console.log(`Trying to save data in dynamoDB for: ${ddbParams.TableName}`)

  docClient.put(ddbParams, function(err, data) {
    if (err) {
      console.log("Error", err);
      reject("Error saving data to dynamoDB")
    } else {
      console.log("Success: data updated in database ", data);
      resolve("Success: data updated in database")
    }
  });
  })
}

this.ddbScan = function ddbScan(ddbTable) {
  return new Promise((resolve, reject) => {

//  Call DynamoDB to get key metadata
  var ddbParams = { TableName: ddbTable }

  console.log('ddbParams',ddbParams)

  // Call DynamoDB to query the table
  docClient.scan(ddbParams, function(err, data) {
    if (err) {
      console.log("Error", err);
      var result = { "Error": err};
      reject();
    } else {
      resolve(data);
    }
  }); //End of docClient query
  }); //End of Promise
}  //End of function

this.processContacts = function processContacts(contacts,i) {
  return new Promise((resolve, reject) => {

    if( i < contacts.length ) {
      infusionsoft.ContactService.addWithDupCheck(mapContact(contacts[i],'crm'),'Email')
        .then(function (contactId) {
          contacts[i]["id"] = contactId;
          console.log("Updated contact:",contacts[i])
          crmContactCfg(mapContact(contacts[i],'tags'));
          cogSignUp(mapContact(contacts[i],'cognito'))
          .then(function(result) {
          	if (contacts[i].tags.indexOf('Entrant') > -1) {
              ddbPut(contactsTable,mapContact(contacts[i],'ddb'));
            }
            resolve();
            processContacts(contacts,i+1);
          })
        })
        .fail(function(err) {
          console.log('uh oh: ' + err);      
                            })
    }
  })  
};

}
