#!/usr/bin/env node

var program = require('commander');

program
  .version('0.0.1')
  .usage('<keywords>')
  .parse(process.argv);
if(!program.args.length){
  program.help();
}else{
  console.log('keywords: ' + program.args);
}
