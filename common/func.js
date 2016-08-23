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

//删除掉第一个'{'出现之前的内容,避免有其他信息混入,用于db文档。
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
//查看是否含有'attributes: {',如果有则删掉之前的元素,用于db文档
exports.attributesExists = function (lines) {
  for (var i in lines) {
    if (/attributes\:\s?\{/.test(lines[i])){
      lines.splice(0, i + 1);
      break;
    }
  }
  return lines;
};
//查看第一个注释出现的地方,用于api文档
exports.clearUnsignContent = function (lines) {
  for(var index in lines){
    if(/[@api | @name | @group | @param  | @paramExample | @success | @successExample,
  | @error | @errorExample | @description]/.test(lines[index])){
      lines.splice(0, index);
      break;
    }else if(index === lines.length - 1){
      lines.splice(0, lines.length);
    }
  }
  return lines;
};
//提取信息,用于api文档
exports.getSignContent = function (line) {
  var sign = ['api', 'name', 'group', 'param', 'paramExample', 'success', 'successExample',
    'error', 'errorExample', 'description'];
  if(/@api/.test(line)){
    const api = line.split('@api')[1].split(' ');
    return {
      method:api[1],
      path:api[2],
      title:api[3]
    }
  }
  if(/@name/.test(line)){
    const name = line.split('@name')[1].split(' ');
    return {
      name:name[1]
    }
  }
  if(/@group/.test(line)){
    const group = line.split('@group')[1].split(' ');
    return {
      group:api[1]
    }
  }
  if(/@param/.test(line)){
    const param = line.split('@param')[1];
    if(/\{.*\}/.text(param)){
      var type = /\{(.*?)\}/.exec(param)[1];
    }
    if(/\[.*\]/.text(param)){
      var field = /\[(.*?)\]/.exec(param)[1];
      var defaultValue = '';
      if(/=/.test(field)){
        field = field.split('=')[0];
        defaultValue = field.split('=')[1];
      }
    }
    if(/required/.test(param)){
      var reqired = true;
    }//TODO description处理
    return {
      method:api[1],
      path:api[2],
      title:api[3]
    }
  }
  if(/@paramExample/.test(line)){
    const api = line.split('@api')[1].split(' ');
    return {
      method:api[1],
      path:api[2],
      title:api[3]
    }
  }
  if(/@success/.test(line)){
    const api = line.split('@api')[1].split(' ');
    return {
      method:api[1],
      path:api[2],
      title:api[3]
    }
  }
  if(/@successExample/.test(line)){
    const api = line.split('@api')[1].split(' ');
    return {
      method:api[1],
      path:api[2],
      title:api[3]
    }
  }
  if(/@error/.test(line)){
    const api = line.split('@api')[1].split(' ');
    return {
      method:api[1],
      path:api[2],
      title:api[3]
    }
  }
  if(/@errorExample/.test(line)){
    const api = line.split('@api')[1].split(' ');
    return {
      method:api[1],
      path:api[2],
      title:api[3]
    }
  }
  if(/@description/.test(line)){
    const api = line.split('@api')[1].split(' ');
    return {
      method:api[1],
      path:api[2],
      title:api[3]
    }
  }
  return;
};

//检查目录路径合法性(末尾时候含有'/'),并修改。
exports.checkPath = function(path){
  if(!(/\/$/.test(path))){
    path += '/';
  }
  return path;
};
exports.removeSymbol = function (code) {
  if(typeof(code) == 'string'){
    const result = code.replace(/[\s\,\']/g, '');
    return result;
  }
}

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
