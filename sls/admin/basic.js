var Dropbox = require('dropbox');

  var mat = 'HZSQzRE332AAAAAAAAABDfxGcs6iExQyXEYXmkT1nOXxzpDekBBmO5MfAW7B3N77'
  var dbx = new Dropbox({ accessToken: mat });
  dbx.filesListFolder({ path: '/Champs Puppy Training' })
    .then(function (response) {
      console.log(response);
    })
    .catch(function (err) {
      console.log(err);
    });
