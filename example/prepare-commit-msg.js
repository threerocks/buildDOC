#!/usr/bin/env node
var exec = require('child_process').exec;

exec('cd ../..', (error, stdout, stderr) => {
  if(error){
    console.error(`exec error: ${error}`);
    return;
  }
  exec('createDOC run', (err) => {
    if(error){
      console.error(`exec error: ${error}`);
      return;
    }
  });
});
