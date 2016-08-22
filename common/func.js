/**
 * Created by mac on 16/8/10.{
 */

//数组快速排序
exports.quickSort = sort;

function sort(array, start, end) {
  if (!array || start >= end) {
    return;
  }
  var i = start;
  var j = end;
  var tmp = array[i];
  while (i < j) {
    while (i < j && array[j] >= tmp) {
      j--;
    }
    if (i < j) {
      array[i++] = array[j];
    }
    while (i < j && array[i] <= tmp) {
      i++;
    }
    if (i < j) {
      array[j--] = array[i];
    }
  }
  array[i] = tmp;
  sort(array, start, i - 1);
  sort(array, i + 1, end);
}

//用于MarkdownBuild,将undefined 转换成false
exports.spaceToFalse = function (str) {
  if(str === undefined){
    return '';
  } else {
    return str;
  }
};

//删除掉第一个'{'出现之前的内容,避免有其他信息混入。
exports.clearHeader = function (lines) {
  for (var i in lines) {
    if(/\/\/.*/.test(lines[i])){
      lines.splice(i, i);
      continue;
    }
    if(/\/\*[\s\S]*?/.test(lines[i])){
      var start = i;
      var end = i;
      while (!/[\s\S]*?\*\//.test(lines[end])) {
        end++;
      }
      lines.splice(start, end + 1);
      continue;
    }
    if (/\{/.test(lines[i])) {
      if (/\/\//.test(lines[i])) {
        continue;
      }
      lines.splice(0, i);
      break;
    }
  }
  return lines;
};
//查看是否含有'attributes: {',如果有则删掉之前的元素
exports.attributesExists = function (lines) {
  for (var i in lines) {
    if (/attributes\:\s?\{/.test(lines[i])){
      lines.splice(0, i + 1);
      break;
    }
  }
  return lines;
};



//type转换
exports.typeTransform = function (type) {
  switch (type) {
    case 'ENUM':
      return 'enum';
      break;
    case 'BOOLEAN':
      return 'boolean';
      break;
    case 'INTEGER':
      return 'int32';
      break;
    case 'BIGINT':
      return 'int64';
      break;
    case 'FLOAT' || 'REAL':
      return 'float';
      break;
    case 'DOUBLE':
      return 'double';
      break;
    case 'DECIMAL':
      return 'number';
      break;
    case 'DATE':
      return 'date-time';
      break;
    case 'DATEONLY':
      return 'date';
      break;
    case 'TIME':
      return 'time';
      break;
    case 'UUID' || 'UUIDV1' || 'UUIDV4':
      return 'uuid';
      break;
    case 'CHAR':
      return 'char';
      break;
    case 'STRING':
      return 'string';
      break;
    case 'TEXT':
      return 'text';
      break;
    case 'JSON' || 'JSONB':
      return 'json';
      break;
    case 'ARRAY':
      return 'array';
      break;
    default:
      return type;
      break;
  }
};
