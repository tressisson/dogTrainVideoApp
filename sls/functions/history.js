'use strict'

require('../lib/common.js')();

const AWS = require('aws-sdk')
const Promise = require('promise');

const historyTable = process.env.HISTORY_TABLE
var docClient = new AWS.DynamoDB.DocumentClient({apiVersion: '2012-08-10'});

module.exports.get = (event, context, callback) => {
  console.log(JSON.stringify(event))

// Main body
console.log(JSON.stringify(event))
var reqEmail=event.queryStringParameters.Email

if (reqEmail !== undefined) {
  ddbGet(historyTable,'Email',reqEmail)
  .then(function (result) 
  {
    var history = result.Items;
    var response = {
        statusCode: 200,
        headers: { "Access-Control-Allow-Origin": "*",
                   "Access-Control-Allow-Credentials" : true, 
                   "Content-Type": "application/json"},
        body: JSON.stringify({ "history": history })
          } 
    console.log("Response: ",response)
    callback(null, response);
  })
  .catch (function(err) {
    var msg = "Error: unable to get Folder Objects"
    var body = {'msg': msg }
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

module.exports.put = (event, context, callback) => {
    
      console.log(JSON.stringify(event))
      var reqBody=JSON.parse(event.body)
      var view = {
          'Email' : reqBody.Email,
          'ObjectId' : reqBody.ObjectId }
      
      ddbPut(historyTable,view)
      .then(function (result) {
          
        var msg = "Success: view history saved to database"
        var body = {'msg': msg}
    
        var response = {
          "statusCode": 200,
          "headers": { "Access-Control-Allow-Origin": "*", "Content-Type": "application/json"},
          "body": JSON.stringify(body)
        }
        callback(null, response);
      })
      .catch (function(err) {
          var msg = "Error: unable to save history"
          var body = {'msg': msg }        
          var response = {
              "statusCode": 200,
              "headers": { "Access-Control-Allow-Origin": "*", "Content-Type": "application/json"},
              "body": JSON.stringify(body)
            }
          console.log(response);
          callback(null, response);      
      })
    
    }