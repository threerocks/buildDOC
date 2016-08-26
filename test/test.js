/**
 * Created by mac on 16/8/22.
 */
var co = require('co');
var asyncFunc = require('./../common/asyncfunc');
var handlebars = require('handlebars');
var config = require('./../common/config');
var fs = require('fs');
var path = require('path');

//co(asyncFunc.initAction)
//co(asyncFunc.runAction);
//co(asyncFunc.showAction);

var data = {
  schemas: process.cwd(),
  dbPath: process.cwd(),
  dbFile: 'db.md',
  controller: process.cwd(),
  routes: process.cwd(),
  apiPath: process.cwd(),
  apiFile: 'api.md',
}
var template = handlebars.compile(config.docjson);
var result = template(data);
console.log(result);
fs.writeFile(path.resolve(__dirname, '..') + '/doc.json', result, function(err){

})