const Promise = require('bluebird'),
  fs = Promise.promisifyAll(require('fs')),
  path = require('path'),
  readline = require('linebyline');

const markdownBuild = require('./MarkdownBuild');

var fileNumber = 0;
var fileCount = 0;
var data = {};

//exports.createDOC = function* (path, markdown) {
function* createDOC(path, markdown) {
  try{
    const files = yield fs.readdirAsync(path);
    fileNumber = files.length;
    for (const file of files) {
      build(path + file, markdown);
    }
  }catch (err){
    console.log(err);
  }
};

function removeSymbol(code) {
  const result = code.replace(/[\s\,\']/g, '');
  return result;
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
  if(/^\./.test(path.basename(file))){
    fileNumber--;
    return;
  }
  //删除掉第一个'{'出现之前的内容,避免有其他信息混入。
  for (const i in lines) {
    if (/\{/.test(lines[i])) {
      if (/\/\//.test(lines[i])) {
        continue;
      }
      lines.splice(0, i);
      break;
    }
  }
  const schemaData = {};
  var tableName = '';
  var count = 0;
  var description = '';
  while (count < lines.length) {
    if (/\/\/.*/.test(lines[count])) {
      description = lines[count].replace(/\/\//, '');
      count++;
      continue;
    }
    else if (/\/\*[\s\S]*?/.test(lines[count])) {
      var start = count;
      lines[count] = lines[count].replace(/\/\*/, '');
      while (!/[\s\S]*?\*\//.test(lines[count])) {
        count++;
      }
      lines[count] = lines[count].replace(/\*\//, '');
      var end = count;
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
      schemaData[key] = value;
      count++;
      continue;
    } else if (/\:/.test(lines[count])) {
      var key = lines[count].split(':')[0];
      var value = {};
      value.type = removeSymbol(lines[count].split(':')[1]);
      value.description = description;
      description = '';
      schemaData[key] = value;
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
  data[tableName] = schemaData;
  fileCount++;
  if (fileCount === fileNumber) {
    console.log(typeof markdownBuild.build);
    return markdownBuild.build(data, markdown);
  }
}


