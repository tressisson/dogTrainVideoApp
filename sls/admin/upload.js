'use strict'

const AWS = require('aws-sdk')
const fs = require('fs')
const async = require('async')

AWS.config.loadFromPath('/home/rlrobert/trainthroughplay/sls/config.json');
const docClient = new AWS.DynamoDB.DocumentClient({apiVersion: '2012-08-10'});
const s3 = new AWS.S3();

const Promise = require('promise');
const objectsTable = 'trainthroughplay-dev-objectsDB-11Y1XMFI147FQ'
const STAGE = 'dev'

//    var videosLocation = '/home/rlrobert/Dropbox/Champs Puppy Training'
var videosLocation = '/home/rlrobert/Videos'

function ddbIdxGet(ddbTable, ddbIndex, ddbKey, ddbKeyValue) {
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


function ddbScan(ddbTable) {
  return new Promise((resolve, reject) => {

//  Call DynamoDB to get key metadata
  var ddbParams = { TableName: ddbTable }

//  console.log('ddbParams',ddbParams)

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
}  //End of ddbScan function

    var objectsDB = []
    var bucket = 'trainthroughplay-dev-media'
    var prefix = ''
    var params = {};
        
//    ddbIdxGet(objectsTable,'folderIdx', 'FolderId', 'csp18151502')
    ddbScan(objectsTable)
    .then(function (result) 
    {
      objectsDB = result.Items

      async.eachLimit(objectsDB, 2, function(object,callback) {
//          setTimeout( function(err,res){
//              console.log("Processing file %s",object.Filename)
//              callback();
//            }, 1000 );

          if (object.Filename != "Unknown") {
              prefix = 'videos/'.concat(object.ObjectId)
              params = { Bucket: bucket,
                         Prefix: prefix  };
              s3.listObjects(params, function(err, data) {
                  if (err) console.log(err, err.stack); // an error occurred
                  else {
                      if (data.Contents.length == 0) {
                        console.log("Uploading object: %s (%s:%s)...",object.VideoTitle,object.ObjectId,object.Filename);
                        var srcFile = fs.createReadStream(videosLocation.concat('/',object.Filename));
                        params = { Bucket:      bucket,
                                   Key:         'videos/'.concat(object.ObjectId),
                                   ContentType: 'video/mp4',
                                   Body:        srcFile }
                        s3.putObject(params, function (err, data) {
                          if (err) {
                            console.log("Error uploading image: ", err); } 
                          else {
                            console.log("Successfully uploaded videofile: %s",object.Filename); }
                          callback();                           
                        })  
                      }
                      else {
                        console.log("Skipping object %s - already exists with Id: %s",object.Filename,object.ObjectId);         
                        callback();                           
                      }
                  } 
              });
          }
      }, function(err) {
            // if any of the file processing produced an error, err would equal that error
             if( err ) { 
               // All processing will now stop.
               console.log('An object failed to process');
             } 
             else { console.log('All objects have been processed successfully'); }
           }
      );
    })
    .catch (function(err) {
      console.log("ddbScan Error:",err)
    })
