#!/usr/bin/env node
var exec = require('child_process').exec;
exec('cd ../..', (error, stdout, stderr) => {
  if(error){
    console.error(`exec error: ${error}`);
    return;
  }
  exec('buildDOC run', function (err) {
    if(err){
      console.error(`exec error: ${err}`);
      return;
    }
  });
});
