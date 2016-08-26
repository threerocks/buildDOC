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
  if (str === undefined) {
    return '';
  } else {
    return str;
  }
};
//初始化命令，人机交互控制
exports.initRepl = function (init, func) {
  var i = 1;
  var inputArr = [];
  var len = init.length;
  process.stdout.write(init[0].description);
  process.stdin.resume();
  process.stdin.setEncoding('utf-8');
  process.stdin.on('data', function (chunk) {
    chunk = chunk.replace(/[\s\n]/, '');
    if(chunk !== 'y' && chunk !== 'Y' && chunk !== 'n' && chunk !== 'N'){
      console.log('您输入的命令是： ' + chunk)
      console.warn('请输入正确指令：y/n');
      process.exit();
    }
    if(
        (init[i-1].title === 'modifyConfirm' || init[i-1].title === 'initConfirm') && 
        (chunk === 'n' || chunk === 'N')
      ){
      process.exit();
    }
    var inputJson = {
      title: init[i - 1].title,
      value: chunk,
    };
    inputArr.push(inputJson);
    if ((len--) > 1) {
      process.stdout.write(init[i++].description)
    } else {
      process.stdin.pause();
      func(inputArr);
    }
  });
}

//删除掉第一个'{'出现之前的内容,避免有其他信息混入,用于db文档。
exports.clearHeader = function (lines) {
  for (var i in lines) {
    if (/\/\/.*/.test(lines[i])) {
      lines.splice(i, i);
      continue;
    }
    if (/\/\*[\s\S]*?/.test(lines[i])) {
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
    if (/attributes\:\s?\{/.test(lines[i])) {
      lines.splice(0, i + 1);
    }
  }
  return lines;
};
//查看第一个注释出现的地方,用于api文档
exports.clearUnsignContent = function (lines) {
  for (var index in lines) {
    if (/^\s?.*\@.*/.test(lines[index])) {
      lines.splice(0, index);
      break;
    } else if (index === lines.length - 1) {
      lines.splice(0, lines.length);
      break;
    }
  }
  return lines;
};
//提取信息,用于api文档
exports.getSignContent = function (line) {
  var sign = ['api', 'name', 'group', 'param', 'paramExample', 'success', 'successExample',
    'error', 'errorExample', 'description'];
  if (/@api/.test(line)) {
    var api = line.split('@api')[1];
    if (/\{.*\}/.test(api)) {
      var method = /\{(.*?)\}/.exec(api)[1];
      api.replace(/\{.*\}/, '');
    }
    var apiArray = api.split(' ');
    console.log(apiArray);
    return {
      method: method,
      path: apiArray[2],
      title: apiArray[3]
    }
  }
  if (/@name/.test(line)) {
    const name = line.split('@name')[1].split(' ');
    return {
      name: name[1]
    }
  }
  if (/@group/.test(line)) {
    const group = line.split('@group')[1].split(' ');
    return {
      group: group[1]
    }
  }
  if (/@param/.test(line)) {
    const param = line.split('@param')[1];
    if (/\{.*\}/.test(param)) {
      var type = /\{(.*?)\}/.exec(param)[1];
      param.replace(/\{.*\}/, '');
    }
    if (/\[.*\]/.test(param)) {
      var field = /\[(.*?)\]/.exec(param)[1];
      var defaultValue = '';
      if (/\=/.test(field)) {
        field = field.split('=')[0];
        defaultValue = field.split('=')[1];
      }
      param.replace(/\[.*\]/, '');
    }
    if (/required/.test(param)) {
      var reqired = true;
      param.replace(/required/, '');
    }
    var description = param;
    return {
      paramType: type,
      field: field,
      defaultValue: defaultValue,
      required: required,
      paramDescription: description,
    }
  }
  if (/@paramExample/.test(line)) {
    return 'paramExample'
  }//TODO example处理
  if (/@success/.test(line)) {
    if (/@success/.test(line)) {
    var success = line.split('@success')[1];
    if (/\{.*\}/.test(success)) {
      var type = /\{(.*?)\}/.exec(success)[1];
      success.replace(/\{.*\}/, '');
    }
    var successArray = success.split(' ');
    console.log(successArray);
    return {
      successType: type,
      status: successArray[1],
      text: successArray[3]
    }
  }
  }
  if (/@successExample/.test(line)) {
    return 'successExample'
  }
  if (/@error/.test(line)) {
    const error = line.split('@name')[1].split(' ');
    return {
      errorDescription: error[1]
    }
  }
  if (/@errorExample/.test(line)) {
    return 'errorExample'
  }
  if (/@description/.test(line)) {
    var description = line.split('@name')[1].split(' ');
    return {
      description: description[1]
    }
  }
  return;
};

//检查目录路径合法性(末尾时候含有'/'),并修改。
exports.checkPath = function (path) {
  if (!(/\/$/.test(path))) {
    path += '/';
  }
  return path;
};
//去除杂乱字符，用于db文档
exports.removeSymbol = function (code) {
  if (typeof (code) == 'string') {
    const result = code.replace(/[\s\,\']/g, '');
    return result;
  }
}
//去除杂乱字符，用于api文档
exports.removeSymbolApi = function (code) {
  if (typeof (code) == 'string') {
    const result = code.replace(/[\,\']/g, '');
    return result;
  }
}

//处理各种example，用于api文档
exports.buildExample = function (count, lines, example, signObj) {
  var start = 0;
  var end = 0;
  if (/\@/.test(lines[count])) {
    start = count;
    lines[start] = lines[start].replace('@' + example, '');
    count++;
    while (!/\@/.test(lines[count]) && /\*/.test(lines[count])) {
      count++;
    }
    end = count;
    signObj[example] = '```' + lines.slice(start, end + 1) + '```';
  }
  return signObj;
}
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
