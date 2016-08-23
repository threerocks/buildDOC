/**
 * @api {method} path title
 * @name name
 * @group group
 * @param {type} [field=defaultValue] required description
 * @paramExample {id:1, name: 'n1'}
 * @success 200 {json} ok
 * @successExample {type} title
 * example
 * @error description
 * @errorExample
 * {code:'xx', msg:'xx'}
 * @description description
 */

const path = require('path'),
  readline = require('linebyline');

const markdownBuild = require('./MarkdownBuild'),
  asyncfunc = require('./../common/asyncfunc'),
  func = require('./../common/func');

// var fileNumber = 0; //需处理的文件总数
// var fileCount = 0; //处理文件计数
// var data = {}; //所有表格整体数据

exports.createDOC = function* (controller, path, markdown) {
  try{
    const files = yield asyncfunc.getAllFiles(path);
    const routes = yield asyncfunc.getRoutes(controller);
    console.log(routes);
    for (var file of files){
      build(file, markdown);
    }
  }catch (err){
    console.log(err);
  }
};

function build(file, markdown) {
  const lines = [];
  const read = readline(file);
  read
    .on('line', function (line, lineCount, byteCount) {
      lines.push(func.removeSymbol(line));
    })
    .on('error', function (e) {
      throw e;
    })
    .on('end', function () {
      //console.log(fileCount + '、 正在处理' + path.basename(file, '.js') + '...');
      createObject(lines, file, markdown);
      //console.log('处理完毕')
    });
}

function createObject(lines, file, markdown) {
  func.clearUnsignContent(lines);
  const singleRouteData = {};
  var routeName = '';
  var count = 0;
  while(count < lines.length){

  }

  fileCount++;
  if (fileCount === fileNumber) {
    return markdownBuild.dbbuild(data, markdown);
  }
}
