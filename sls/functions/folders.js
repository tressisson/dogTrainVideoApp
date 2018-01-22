'use strict'

require('../lib/common.js')();

const AWS = require('aws-sdk')
const Promise = require('promise');

const foldersTable = process.env.FOLDERS_TABLE
const itemsTable = process.env.ITEMS_TABLE
var docClient = new AWS.DynamoDB.DocumentClient({apiVersion: '2012-08-10'});

module.exports.get = (event, context, callback) => {
  console.log(JSON.stringify(event))

  function compare(a, b) {
    let comparison = 0;
    if (a.FolderSeq > b.FolderSeq) { comparison = 1}
    else if ( a.FolderSeq < b.FolderSeq ) {comparison = -1}
    return comparison;
  }

// Main body
console.log(JSON.stringify(event))

  ddbScan(foldersTable)
  .then(function (result) 
  {
    var folders = result.Items.sort(compare);
    var response = {
        statusCode: 200,
        headers: { "Access-Control-Allow-Origin": "*",
                   "Access-Control-Allow-Credentials" : true, 
                   "Content-Type": "application/json"},
        body: JSON.stringify({ "folders": folders })
          } 
    console.log("Response: ",response)
    callback(null, response);
  })
  .catch (function(err) {
    var msg = "Error: unable to get Folders"
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
