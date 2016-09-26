'use strict';

const readline = require('linebyline');

let fileNumber = 0, //需处理的文件总数
    fileCount  = 0; //处理文件计数
const data     = {}; //所有表格整体数据

const createObject = function (lines, file, markdown) {
  func.clearHeader(lines); //去掉头部注释和其他无用信息,注意此函数以'{'为结尾删除元素。
  func.attributesExists(lines);//如果存在attributes属性,删掉该条元素。

  const singleTableData = {}; //单表数据存储
  let tableName         = '', //当前表格名称
      count             = 0, //遍历计数
      description       = '';  //字段描述

  while (count < lines.length) {
    //判断是否属于 '//' 类型注释,是否属于 '/* */'类型注释,是否为key,value,并分别做处理
    if (/\/\/.*/.test(lines[count])) {
      description = lines[count].replace(/\/\//, '');
      count++;
      continue;
    } else if (/\/\*[\s\S]*?/.test(lines[count])) {
      const start = count;
      lines[count] = lines[count].replace(/\/\*/, '');
      while (!/[\s\S]*?\*\//.test(lines[count])) {
        count++;
      }
      lines[count] = lines[count].replace(/\*\//, '');
      const end = count;
      description = '<pre>' + lines.slice(start, end + 1).join('<br>') + '</pre>';
      count++;
      continue;
    }
    else if (/\:\s?\{/.test(lines[count])) {
      const key = lines[count].split(':')[0];
      const value = {};
      count++;
      while (!/\}/.test(lines[count])) {
        const child      = lines[count].split(':');
        const childKey   = child[0];
        let childValue   = child[1];
        if (childKey === 'type') {
          childValue = childValue.split('.')[1] || childValue;
        }
        value[childKey] = func.removeSymbol(childValue);
        count++;
      }
      value.description    = description;
      description          = '';
      singleTableData[key] = value;
      count++;
      continue;
    } else if (/\:/.test(lines[count])) {
      const child    = lines[count].split(':');
      const childKey = child[0];
      let childValue = child[1];
      childValue = childValue.split('.')[1] || childValue;
      
      const value = {};
      value.type        = func.removeSymbol(childValue);
      value.description = description;
      description       = '';
      singleTableData[childKey] = value;
      count++;
      continue;
    } else {
      count++;
    }
    if (/tableName\:/.test(lines[count])) tableName = lines[count].split(':')[1];
  }
  if (tableName === '') tableName = path.basename(file, '.js');
  data[tableName] = singleTableData;
  fileCount++;
  if (fileCount === fileNumber) return markdownBuild.dbbuild(data, markdown);
};

const build = function (file, markdown) {
  const lines = [],
        read = readline(file);
  read
    .on('line', (line, lineCount, byteCount) => { // eslint-disable-line
      lines.push(func.removeSymbol(line));
    })
    .on('error', (e) => {
      throw e;
    })
    .on('end', () => {
      console.log(fileCount + '、 正在处理' + path.basename(file, '.js') + '...');
      createObject(lines, file, markdown);
      console.log(config.colors.blue('处理完毕'));
    });
};

exports.createDOC = function* (path, markdown) {
  try{
    const files = yield asyncFunc.getAllFiles(path);
    fileNumber = files.length;
    for (const file of files) {
      build(file, markdown);
    }
  }catch (err){
    console.log(err);
  }
};

