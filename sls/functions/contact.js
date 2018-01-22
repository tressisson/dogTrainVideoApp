'use strict'

require('../lib/common.js')();

var contact = {}
  
module.exports.get = (event, context, callback) => {
  console.log(JSON.stringify(event))
  var reqEmail=event.queryStringParameters.email.toLowerCase()
  var reqPassword=event.queryStringParameters.key
  var contact = {}

  crmContactGet(reqEmail)
  .then(function (result) 
    {
      var msg = result.msg
      if (result.status != 'Not found') {
        contact.firstname = result.FirstName
        contact.lastname = result.LastName
        contact.tags = result.Tags
        if (result.Password == reqPassword) {
          contact.status = 'Authenticated'
        }
        else {
          contact.status = 'Password mismatch'
        }
      }
      else { contact = result }
      var body = {'msg': 'Success: getContact completed',
                  'contact': contact};        
      var response = {
          statusCode: 200,
          headers: { "Access-Control-Allow-Origin": "*", "Content-Type": "application/json"},
          body: JSON.stringify(body)
          }

      console.log("RESPONSE:",response);    	

      callback(null, response);      
    })
}

module.exports.post = (event, context, callback) => {
  console.log(JSON.stringify(event))

  // Main body
  if (event.queryStringParameters === null) {
    var queryStringParameters={}
    var parms=event.body.split('&')
    var kv=[]
    parms.forEach(function(parm) {
      kv=parm.split('=')
      queryStringParameters[kv[0]]=kv[1]
    })
    event.queryStringParameters = queryStringParameters
  }
  
  console.log("qSP:",event.queryStringParameters)
  var contact = {}
  var phone = ''
  contact.email=event.queryStringParameters.email.toLowerCase().replace('%40','@')
  contact.password=event.queryStringParameters.password
  contact.firstname=event.queryStringParameters.firstname
  contact.lastname=event.queryStringParameters.lastname
  phone=event.queryStringParameters.phone
  if (phone.indexOf('%28') == 0 && phone.indexOf('%29') == 6) {
    // phone is in (XXX) XXX-XXXX format
    contact.phone=phone.substr(3,3)+phone.substr(10,3)+phone.substr(14,4)
  }
  else {
    contact.phone=phone    
  }
  
  if ( contact.email === undefined || contact.password === undefined || contact.firstname === undefined || contact.lastname === undefined || contact.phone === undefined) 
    { console.log('ERROR: missing URL param') }
  else {
    cogSignUp(mapContact(contact,'cognito'))
    .then(function(result) {
      var msg = "Success: contact successfully signed up"
      var body = {'msg': msg};        
      var response = {
          "statusCode": 200,
          "headers": { "Access-Control-Allow-Origin": "*", "Content-Type": "application/json"},
          "body": JSON.stringify(body)
      }
      console.log(response);
      callback(null, response);
    })
    .catch (function(err) {
      var msg = "Error: unable to create user"
      var body = {'msg': msg, 
                  'err': err }
      var response = {
          "statusCode": 200,
          "headers": { "Access-Control-Allow-Origin": "*", "Content-Type": "application/json"},
          "body": JSON.stringify(body)
        }
      console.log(response);
      callback(null, response);
    })
  }

}

