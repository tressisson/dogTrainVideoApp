'use strict'

require('../lib/common.js')();

const AWS = require('aws-sdk')
const Promise = require('promise');

const objectsTable = process.env.OBJECTS_TABLE
var docClient = new AWS.DynamoDB.DocumentClient({apiVersion: '2012-08-10'});

function compare(a, b) {
  let comparison = 0;
  if (a.FolderId == b.FolderId && a.ObjectSeq > b.ObjectSeq) { comparison = 1}
   else if (a.FolderId == b.FolderId && a.ObjectSeq < b.ObjectSeq) {comparison = -1}
        else if (a.FolderId < b.FolderId) {comparison = -1}
            else if (a.FolderId > b.FolderId) {comparison = 1}
  return comparison;
}

module.exports.get = (event, context, callback) => {
  console.log(JSON.stringify(event))

// Main body
console.log(JSON.stringify(event))
var reqFolderId='TBD'

if (event.queryStringParameters !== null) {
    if (event.queryStringParameters.FolderId !== undefined) {
        reqFolderId=event.queryStringParameters.FolderId }
}

if (reqFolderId !== 'TBD') {
  ddbIdxGet(objectsTable,'folderIdx','FolderId',reqFolderId)
  .then(function (result) 
  {
    var objects = result.Items.sort(compare);
    var response = {
        statusCode: 200,
        headers: { "Access-Control-Allow-Origin": "*",
                   "Access-Control-Allow-Credentials" : true, 
                   "Content-Type": "application/json"},
        body: JSON.stringify({ "objects": objects })
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
else {
  ddbScan(objectsTable)
  .then(function (result) 
  {
    var objects = result.Items.sort(compare);
    var response = {
        statusCode: 200,
        headers: { "Access-Control-Allow-Origin": "*",
                   "Access-Control-Allow-Credentials" : true, 
                   "Content-Type": "application/json"},
        body: JSON.stringify({ "objects": objects })
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
