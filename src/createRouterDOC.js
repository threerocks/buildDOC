/**
 * @api {method} path title
 * @name name
 * @group group
 * @param {type} [field=defaultValue] required description
 * @paramExample {id:1, name: 'n1'}
 * @success 200 {type} ok
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
  try {
    const files = yield asyncfunc.getAllFiles(path);
    const routes = yield asyncfunc.getRoutes(controller);
    for (var file of files) {
      build(file, markdown);
    }
  } catch (err) {
    console.log(err);
  }
};

function build(file, markdown) {
  const lines = [];
  const read = readline(file);
  read
    .on('line', function (line, lineCount, byteCount) {
      lines.push(func.removeSymbolApi(line));
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
  while (count < lines.length) {
    //TODO key获取和处理
    var value = {};
    var sign = func.getSignContent(lines[count]);
    if (typeof (sign) === 'string') {
      var signObj = {};
      switch (sign) {
        case 'paramExample':
          Object.assgin(value, func.buildExample(count, lines, 'paramExample', signObj));
          break;
        case 'successExample':
          Object.assgin(func.buildExample(count, lines, 'successExample', signObj));
          break;
        case 'errorExample':
          Object.assgin(func.buildExample(count, lines, 'errorExample', signObj));
          break;
        default:
          count++;
          break;
      }
      continue;
    } else {
      Object.assgin(value, sign);
      count++;
      continue;
    }
  }
  fileCount++;
  if (fileCount === fileNumber) {
    return markdownBuild.dbbuild(data, markdown);
  }
}
