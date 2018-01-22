var csv = require('csv-parser')
var fs = require('fs')
const AWS = require('aws-sdk')
const uuid = require('uuid')

AWS.config.loadFromPath('./config.json');
const docClient = new AWS.DynamoDB.DocumentClient({apiVersion: '2012-08-10'});

//const foldersTable = process.env.FOLDERS_TABLE
//const itemsTable = process.env.ITEMS_TABLE
const foldersTable = 'trainthroughplay-dev-foldersDB-19YPMDFI34R77'
const objectsTable = 'trainthroughplay-dev-objectsDB-11Y1XMFI147FQ'

var folder = {}

function putDB(ddbTable, obj) {
    return new Promise((resolve, reject) => {
  
  //  Call DynamoDB to save data in database
    var ddbParams = {
        TableName: ddbTable,
        Item: obj
      };
  
//    console.log("Trying to save data:",obj)
  
    docClient.put(ddbParams, function(err, data) {
      if (err) {
        console.log("Error", err);
      } else {
  //      console.log("Success");
        resolve("putDB Success");
      }
    });
    }); // end of promise
  } // end of putDB

  fs.createReadStream('admin/CourseOutline.csv')
  .pipe(csv({'separator': ';'}))
  .on('data', function (data) {
      if (data.CategoryTitle != '') {
        folder = {} ;
        folder.FolderId = data.CategoryId ;
        folder.FolderTitle = data.CategoryTitle;
        folder.FolderSeq = Number(data.Sequence);
        if (folder.PreReq == '') {folder.PreReq = null}
            else { folder.PreReq = Number(data.PreRequisite) }
        folder.Image = data.Image;
        if (folder.Tags == '') folder.Tags = null;
        console.log("%d %s %s",folder.FolderSeq,folder.FolderTitle,folder.Image);
        putDB(foldersTable,folder)
        object = {} ;
        object.FolderId = data.CategoryId ;
        object.ObjectId = data.ObjectId ;
        object.ObjectSeq = Number(data.VideoSequence) ;
        object.VideoTitle = data.VideoTitle ;
        object.Filename = data.Filename ;
        if (data.Freemium == 'Y') {
          object.Freemium = true ;
        }
        else {
          object.Freemium = false ;
        }
        console.log("   (%s) %s %s %s",object.ObjectId,object.ObjectSeq,object.VideoTitle,object.Filename);
        putDB(objectsTable,object)       
      }
      else {
        object = {} ;
        object.FolderId = folder.FolderId ;
        object.ObjectId = data.ObjectId ;
        object.ObjectSeq = Number(data.VideoSequence) ;
        object.VideoTitle = data.VideoTitle ;
        object.Filename = data.Filename ;
        if (data.Freemium == 'Y') {
          object.Freemium = true ;
        }
        else {
          object.Freemium = false ;
        }
        console.log("   (%s.%s) %s %s %s",object.FolderId,object.ObjectId,object.ObjectSeq,object.VideoTitle,object.Filename);
        putDB(objectsTable,object)
      }
  })
