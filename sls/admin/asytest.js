var async = require('async');

var objectsDB=[ 
  { ObjectId: 'bcdad105', Filename: 'Stop_Trying_to_Train.m4v', FolderId: 'csp2125203', VideoTitle: 'Stop Trying to Train', ObjectSeq: 1 },
  { ObjectId: 'e7bf5aed', Filename: 'Your_Puppy is_a_Dog.m4v', FolderId: 'csp2125203', VideoTitle: 'Your Puppy is a Dog', ObjectSeq: 2 },
  { ObjectId: 'f65b8e75', Filename: 'Being_Proactive.m4v', FolderId: 'csp2125203', VideoTitle: 'Being Proactive', ObjectSeq: 3 },
  { ObjectId: 'a3b2b02c', Filename: 'Failing_Forward.m4v', FolderId: 'csp2125203', VideoTitle: 'Failing Forward', ObjectSeq: 4 },
  { ObjectId: '4587d76a', Filename: 'Its_Not_Okay.mov', FolderId: 'csp2125203', VideoTitle: 'Its Not Okay', ObjectSeq: 5 },
  { ObjectId: 'bf7f257c', Filename: 'Seperation_Anxiety.mov', FolderId: 'csp2125203', VideoTitle: 'Separation Anxiety', ObjectSeq: 6 } ]

function processFile(object) {
    setTimeout( function(err,res){
      console.log("Processing file %s",object.Filename)
    }, 1000 );
}


async.eachLimit(objectsDB, 2, function(object,callback) {

  setTimeout( function(err,res){
      console.log("Processing file %s",object.Filename)
      callback();
    }, 1000 );

}, function(err) {
    // if any of the file processing produced an error, err would equal that error
     if( err ) {
       // One of the iterations produced an error.
       // All processing will now stop.
       console.log('An object failed to process');
     } else {
       console.log('All objects have been processed successfully');
     }
   }
);
