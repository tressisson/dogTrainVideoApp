'use strict';

const AWS = require('aws-sdk')

var credentials = {
  accessKeyId: process.env.S3PARAM1,
  secretAccessKey: process.env.S3PARAM2,
  region: process.env.S3PARAM3
};
const s3 = new AWS.S3(credentials);
const s3media = process.env.S3MEDIA
const folder = 'eim2018/'

module.exports.get = (event, context, callback) => {

function getSignedUrl(key,urlType,contenttype) {
  return new Promise((resolve, reject) => {
    
  var params = {Bucket : s3media, 
                Key    : key,
                Expires: 900};
  var signedURL = ''
  console.log("getSignedUrl: file being processed - ",key)
  if (urlType == 'get') {
    s3.getSignedUrl('getObject', params, function (err, url) {
      if (err) {
    	  console.log("Error: ",err);
        reject(); }
      else {
        resolve(url); }
      });
  }
  else if (urlType == 'put') {
    s3.getSignedUrl('putObject', params, function (err, url) {
      if (err) {
        console.log("Error: ",err); 
        reject();       
      }
      else {
        resolve(url); }
    });
  }
}) //end of promise
}

  console.log(JSON.stringify(event))
  var reqObjectId=event.queryStringParameters.ObjectId;
  var objectkey = 'videos'.concat('/',reqObjectId);
  var contenttype = ''
  
  if (reqObjectId !== undefined) {
    getSignedUrl(objectkey,'get',contenttype)
    .then(function (fileurl) {
      var msg = "Success: pre-signed URL generated"
      var body = {'msg': msg,
                  'fileurl': fileurl}
      var response = {
          "statusCode": 200,
          "headers": { "Access-Control-Allow-Origin": "*", "Content-Type": "application/json"},
          "body": JSON.stringify(body)
      }

      callback(null, response);
    })
  }

}

