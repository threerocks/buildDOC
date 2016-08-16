var fs = require('fs'),
    path = require('path'),
    readline = require('linebyline'),
    config = require('./common/config'),
    markdownBuild = require('./src/MarkdownBuild');
var fileNumber = 0;
var fileCount = 0;
var data = {};
fs.readdir('./models', function (err, files) {
  if (err) {
    throw err;
  } else {
    fileNumber = files.length;
    for (var file of files) {
      build(config.path + file);
    }
  }
});

function build(file) {
  var lines = [];
  var r = readline(file);
  r.on('line', function (line, lineCount, byteCount) {
    lines.push(removeSymbol(line));

  })
    .on('error', function (e) {
      throw e;
    })
    .on('end', function () {
      console.log(fileCount + '、 正在处理' + path.basename(file, '.js') + '...');
      createObject(lines, file);
      lines = [];
      console.log('处理完毕')
    });
}

function removeSymbol(code) {
  var result = code.replace(/[\s\\,\']/g, '');
  return result;
}
function createObject(lines, file) {
  //删除掉第一个'{'出现之前的内容,避免有其他信息混入。
  for (var i in lines) {
    if (/\{/.test(lines[i])) {
      lines.splice(0, i);
      break;
    }
  }
  const schemaData = {};
  var tableName = '';
  var description = '';
  var count = 0;
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
        if(childKey === 'type'){
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
    } else {
      count++;
    }
    if (/tableName\:/.test(lines[count])) {
      tableName = lines[count].split(':')[1];
    }
  }
  if(tableName === '') {
    tableName = path.basename(file, '.js')
  }
  data[tableName] = schemaData;
  fileCount++;
  if(fileCount === fileNumber){
    markdownBuild(data);
  }
}
