'use strict';

/**
 * Created by mac on 16/8/10.{
 */

//数组快速排序
const sort = function (array, start, end) {
  if (!array || start >= end) return;
  let i = start,
      j = end;
  const tmp = array[i];
  while (i < j) {
    while (i < j && array[j] >= tmp) j--;
    if (i < j) array[i++] = array[j];
    while (i < j && array[i] <= tmp) i++;
    if (i < j) array[j--] = array[i];
  }
  array[i] = tmp;
  sort(array, start, i - 1);
  sort(array, i + 1, end);
};
exports.quickSort = sort;

//用于markdownBuild,将undefined 转换成false
exports.spaceToFalse = function (str) {
  if (str === undefined) return '';
  else return str;
};

//用于markdownBuild，根据对象属性进行赋值
exports.propertyAssign = function (api) {
  const properties = Object.keys(api);
  let description = '',
      path        = '',
      method      = '',
      example     = '',
      other       = '',
      paramTable  = '',
      returnTable = '';
  for (const property of properties) {
    switch (property) {
      case 'description':
        description = api[property];
        break;
      case 'path':
        path = api[property];
        break;
      case 'method':
        method = api[property];
        break;
      case 'example':
        example = api[property];
        break;
      case 'other':
        other = api[property];
        break;
      case 'param':
        if (Array.isArray(api[property])) {
          for (const param of api[property]) {
            paramTable = paramTable +
              '|' + param.name +
              '|' + param.defaultValue +
              '|' + param.type +
              '|' + param.description;
            paramTable += '|\n';
          }
        }
        break;
      case 'returnValue':
        returnTable = returnTable +
          '|' + api[property].type +
          '|' + api[property].description + '|\n';
        break;
      default:
        break;
    }
  }
  return {
    description,
    path,
    method,
    example,
    other,
    paramTable,
    returnTable
  };
};

//初始化命令，人机交互控制
exports.initRepl = function (init, func) {
  let i = 1;
  const inputArr = [];
  let len = init.length;
  process.stdout.write(init[0].description);
  process.stdin.resume();
  process.stdin.setEncoding('utf-8');
  process.stdin.on('data', (chunk) => {
    chunk = chunk.replace(/[\s\n]/, '');
    if (chunk !== 'y' && chunk !== 'Y' && chunk !== 'n' && chunk !== 'N') {
      console.log(config.colors.red('您输入的命令是： ' + chunk));
      console.warn(config.colors.red('请输入正确指令：y/n'));
      process.exit();
    }
    if (
      (init[i - 1].title === 'modifyConfirm' || init[i - 1].title === 'initConfirm') &&
      (chunk === 'n' || chunk === 'N')
    ) process.exit();
    const inputJson = {
      title: init[i - 1].title,
      value: chunk,
    };
    inputArr.push(inputJson);
    if ((len--) > 1) process.stdout.write(init[i++].description);
    else {
      process.stdin.pause();
      func(inputArr);
    }
  });
};

//删除掉第一个'{'出现之前的内容,避免有其他信息混入,用于db文档。
exports.clearHeader = function (lines) {
  for (const i in lines) {
    if (/\/\/.*/.test(lines[i])) {
      lines.splice(i, i);
      continue;
    }
    if (/\/\*[\s\S]*?/.test(lines[i])) {
      const start = i;
      let end = i;
      while (!/[\s\S]*?\*\//.test(lines[end])) {
        end++;
      }
      lines.splice(start, end + 1);
      continue;
    }
    if (/\{/.test(lines[i])) {
      if (/\/\//.test(lines[i])) continue;
      lines.splice(0, i);
      break;
    }
  }
  return lines;
};

//查看是否含有'attributes: {',如果有则删掉之前的元素,用于db文档
exports.attributesExists = function (lines) {
  for (const i in lines) {
    /attributes\:\s?\{/.test(lines[i]) && lines.splice(0, i + 1);
  }
  return lines;
};

//检查目录路径合法性(末尾时候含有'/'),并修改。
exports.checkPath = function (path) {
  (!(/\/$/.test(path))) && (path += '/');
  return path;
};

//去除杂乱字符，用于db文档
exports.removeSymbol = function (code) {
  if (typeof (code) === 'string') {
    const result = code.replace(/[\s\,\']/g, '');
    return result;
  }
};

//type转换
exports.typeTransform = function (type) {
  switch (type) {
    case 'ENUM':
      return 'enum';
    case 'BOOLEAN':
      return 'boolean';
    case 'INTEGER':
      return 'int32';
    case 'BIGINT':
      return 'int64';
    case 'FLOAT' || 'REAL':
      return 'float';
    case 'DOUBLE':
      return 'double';
    case 'DECIMAL':
      return 'number';
    case 'DATE':
      return 'date-time';
    case 'DATEONLY':
      return 'date';
    case 'TIME':
      return 'time';
    case 'UUID' || 'UUIDV1' || 'UUIDV4':
      return 'uuid';
    case 'CHAR':
      return 'char';
    case 'STRING':
      return 'string';
    case 'TEXT':
      return 'text';
    case 'JSON' || 'JSONB':
      return 'json';
    case 'ARRAY':
      return 'array';
    default:
      return type;
  }
};
