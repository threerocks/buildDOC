const path = require('path'),
  readline = require('linebyline');

const markdownBuild = require('./MarkdownBuild'),
  asyncfunc = require('./../common/asyncfunc'),
  func = require('./../common/func');

var fileNumber = 0; //需处理的文件总数
var fileCount = 0; //处理文件计数
var data = {}; //所有表格整体数据

exports.createDOC = function* (path, markdown) {
  try{
    const files = yield asyncfunc.getAllFiles(path);
    fileNumber = files.length;
    for (var file of files) {
      build(file, markdown);
    }
  }catch (err){
    console.log(err);
  }
};

function removeSymbol(code) {
  //console.log(typeof(code))
  if(typeof(code) == 'string'){
    const result = code.replace(/[\s\,\']/g, '');
    return result;
  }
}

function build(file, markdown) {
  const lines = [];
  const read = readline(file);
  read
    .on('line', function (line, lineCount, byteCount) {
      lines.push(removeSymbol(line));
    })
    .on('error', function (e) {
      throw e;
    })
    .on('end', function () {
      console.log(fileCount + '、 正在处理' + path.basename(file, '.js') + '...');
      createObject(lines, file, markdown);
      console.log('处理完毕')
    });
}

function createObject(lines, file, markdown) {
  func.clearHeader(lines); //去掉头部注释和其他无用信息,注意此函数以'{'为结尾删除元素。
  func.attributesExists(lines);//如果存在attributes属性,删掉该条元素。

  const singleTableData = {}; //单表数据存储
  var tableName = ''; //当前表格名称

  var count = 0; //遍历计数
  var description = '';  //字段描述

  while (count < lines.length) {
    //判断是否属于 '//' 类型注释,是否属于 '/* */'类型注释,是否为key,value,并分别做处理
    if (/\/\/.*/.test(lines[count])) {
      description = lines[count].replace(/\/\//, '');
      count++;
      continue;
    } else if (/\/\*[\s\S]*?/.test(lines[count])) {
      start = count;
      lines[count] = lines[count].replace(/\/\*/, '');
      while (!/[\s\S]*?\*\//.test(lines[count])) {
        count++;
      }
      lines[count] = lines[count].replace(/\*\//, '');
      end = count;
      description = '<pre>' + lines.slice(start, end + 1).join('<br>') + '</pre>';
      count++;
      continue;
    }
    else if (/\:\s?\{/.test(lines[count])) {
      var key = lines[count].split(':')[0];
      var value = {};
      count++;
      while (!/\}/.test(lines[count])) {
        var child = lines[count].split(':');
        var childKey = child[0];
        var childValue = child[1];
        if (childKey === 'type') {
          childValue = childValue.split('.')[1] || childValue
        }
        value[childKey] = removeSymbol(childValue);
        count++;
      }
      value.description = description;
      description = '';
      singleTableData[key] = value;
      count++;
      continue;
    } else if (/\:/.test(lines[count])) {
      var child = lines[count].split(':');
      var childKey = child[0];
      var childValue = child[1];
      childValue = childValue.split('.')[1] || childValue;
      console.log(childValue)
      var value = {};
      value.type = removeSymbol(childValue);
      value.description = description;
      description = '';
      singleTableData[childKey] = value;
      count++;
      continue;
    } else {
      count++;
    }
    if (/tableName\:/.test(lines[count])) {
      tableName = lines[count].split(':')[1];
    }
  }
  if (tableName === '') {
    tableName = path.basename(file, '.js')
  }
  data[tableName] = singleTableData;
  fileCount++;
  if (fileCount === fileNumber) {
    return markdownBuild.dbbuild(data, markdown);
  }
}
