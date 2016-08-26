const Promise = require('bluebird'),
  fs = Promise.promisifyAll(require('fs')),
  path = require('path'),
  co = require('co'),
  handlebars = require('handlebars');

const craeteDb = require('./../src/createDbDOC'),
  createRouter = require('./../src/createRouterDOC'),
  func = require('./func'),
  config = require('./config');

//初始化新建doc.json,处理函数
function* newDoc(inputInfos) {
  if (!Array.isArray(inputInfos) || inputInfos.length <= 0) {
    return;
  }
  for (var inputinfo of inputInfos) {
    var data = {
      schemas: "",
      dbPath: "",
      dbFile: "",
      controller: "",
      routes: "",
      apiPath: "",
      apiFile: "",
    }
    switch (inputinfo.title) {
      case 'modifyConfirm' || 'initConfirm':
        break;
      case 'defaultConfirm':
        if (inputinfo.value === 'n' || inputinfo.value === 'N') {
          var template = handlebars.compile(config.docjson);
          var result = template(data);
          yield fs.writeFileAsync(process.cwd() + '/doc.json', result);
          break;
        }
        data.schemas = process.cwd();
        data.dbPath = process.cwd();
        data.dbFile = 'db.md';
        data.controller = process.cwd();
        data.routes = process.cwd();
        data.apiPath = process.cwd();
        data.apiFile = 'api.md';
        var template = handlebars.compile(config.docjson);
        var result = template(data);
        yield fs.writeFileAsync(process.cwd() + '/doc.json', result);
        break;
      case 'buildConfirm':
        if (inputinfo.value === 'n' || inputinfo.value === 'N') {
          break;
        }
        var content = yield fs.readFileAsync(process.cwd() + '/doc.json', 'utf-8');
        console.log('');
        console.log('======= doc.json ========');
        console.log(content);
        console.log('==== 请继续配置详细路径 ====');
        console.log('');
        break;
      default:
        break;
    }
  }
}
//初始化覆盖doc.json,处理函数

function* modifyHook(file) {
  try {
    const inputFile = process.cwd() + '/.git/hooks/prepare-commit-msg';
    const content = yield fs.readFileAsync(file);
    yield fs.writeFileAsync(inputFile, content);
    console.log('修改 ' + inputFile + ' 成功。');
  } catch (err) {
    console.warn(err);
  }
}

function exists(file) {
  return new Promise((resolve, reject) => {
    fs.exists(file, function (exists) {
      if (!exists) resolve(exists);
      resolve(exists);
    });
  });
}
exports.initAction = function* () {
  try {
    var docPath = yield exists(process.cwd() + '/doc.json');
    if (docPath) {
      func.initRepl(config.coverInit, arr => {
        co(newDoc(arr));
      })
    } else {
      yield fs.openAsync(process.cwd() + '/doc.json', 'w');
      yield fs.writeFileAsync(process.cwd() + '/doc.json', yield fs.readFileAsync(path.resolve(__dirname, '..') + '/example/doc.json'));
      console.log();
    }
  } catch (err) {
    console.warn(err);
  }
};

exports.showAction = function* () {
  try {
    var docPath = yield exists(process.cwd() + '/doc.json');
    if (docPath) {
      const doc = require(process.cwd() + '/doc.json');
      doc.db.markdown.path = func.checkPath(doc.db.markdown.path);
      doc.db.schemas = func.checkPath(doc.db.schemas);
      doc.api.markdown.path = func.checkPath(doc.api.markdown.path);
      doc.api.routes = func.checkPath(doc.api.routes);
      const dbMarkdownPath = yield exists(doc.db.markdown.path);
      const dbSchemas = yield exists(doc.db.schemas);
      const apiController = yield exists(doc.api.controller);
      const apiMarkdownPath = yield exists(doc.api.markdown.path);
      const apiRouters = yield exists(doc.api.routes);
      console.log(`
======= √只表示路径存在，不代表路径配置正确 =======
======= X只表示路径不存在 =======

${docPath ? '√' : 'X'}   doc.json -> ${process.cwd()}/doc.json
     
  db:
${dbSchemas ? '√' : 'X'}   输入 <- ${doc.db.schemas}
${dbMarkdownPath ? '√' : 'X'}   输出 -> ${doc.db.markdown.path}${doc.db.markdown.file}
      
  api:
${apiController ? '√' : 'X'}   控制 <- ${doc.api.controller}
${apiMarkdownPath ? '√' : 'X'}   输入 <- ${doc.api.routes}
${apiRouters ? '√' : 'X'}   输出 -> ${doc.api.markdown.path}${doc.api.markdown.file}`)
      return;
    } else {
      console.warn(config.nofile);
      return;
    }
  } catch (err) {
    console.warn(err);
  }
};

exports.runAction = function* () {
  try {
    const docPath = yield exists(process.cwd() + '/doc.json');
    if (docPath) {
      const doc = require(process.cwd() + '/doc.json');
      // 处理db文档
      doc.db.markdown.path = func.checkPath(doc.db.markdown.path);
      doc.db.schemas = func.checkPath(doc.db.schemas);
      yield craeteDb.createDOC(doc.db.schemas, doc.db.markdown);
      // 处理api文档
      doc.api.markdown.path = func.checkPath(doc.api.markdown.path);
      doc.api.routes = func.checkPath(doc.api.routes);
      yield createRouter.createDOC(doc.api.controller, doc.api.routes, doc.api.markdown);
    } else {
      console.warn(config.nofile);
      return;
    }
  } catch (err) {
    console.log(err);
  }
};

exports.modifyhookAction = function* () {
  try {
    console.log(config.startModifyhook);
    const commitSamplePath = yield exists(process.cwd() + '/.git/hooks/prepare-commit-msg.sample');
    const commitPath = yield exists(process.cwd() + '/.git/hooks/prepare-commit-msg');
    if (!commitPath && !commitSamplePath) {
      console.log(config.nohook)
    } else if (commitSamplePath) {
      yield fs.renameAsync(process.cwd() + '/.git/hooks/prepare-commit-msg.sample',
        process.cwd() + '/.git/hooks/prepare-commit-msg');
      yield modifyHook(path.resolve(__dirname, '..') + '/example/prepare-commit-msg.js');
    } else if (commitPath) {
      yield modifyHook(path.resolve(__dirname, '..') + '/example/prepare-commit-msg.js');
    }
  } catch (err) {
    console.warn(err);
  }
};

//遍历目录文件,包括子目录
exports.getAllFiles = getFiles;
function* getFiles(dir) {
  try {
    var filesArr = [];
    var files = yield fs.readdirAsync(dir);
    for (var file of files) {
      var pathName = dir + file;
      var info = yield fs.statAsync(pathName);
      if (info.isDirectory()) {
        filesArr = filesArr.concat(yield getFiles(pathName + '/'));
      }
      if (path.extname(file) === '.js') {
        filesArr.push(dir + file);
      }
    }
    return filesArr;
  } catch (err) {
    console.warn(err);
  }
}

exports.getRoutes = function* (file) {
  const request = ['GET', 'POST', 'PUT', 'DELETE', 'INPUT', 'TRACE', 'OPTIONS', 'HEAD'
    , 'get', 'post', 'put', 'delete', 'input', 'trace', 'options', 'head'];
  var content = yield fs.readFileAsync(file);
  var dirtyRoutes = content.toString().match(/\[.*\]/g);
  var routes = [];
  var data = {};
  for (var dirtrRoute of dirtyRoutes) {
    var result = dirtrRoute.replace(/[\[\]\s\']/g, '').split(',');
    if (request.indexOf(result[0]) > -1) {
      routes.push(result)
    }
  }
  for (var route of routes) {
    var key = route[3];
    var value = {};
    value.path = route[1];
    value.method = route[0];
    value.group = route[2].split('.')[1] || route[2];
    data[key] = value;
  }
  return data;
};



