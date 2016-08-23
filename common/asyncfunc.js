const Promise = require('bluebird'),
  fs = Promise.promisifyAll(require('fs')),
  path = require('path'),
  co = require('co');

const craeteDb = require('./../src/createDbDOC'),
  createRouter = require('./../src/createRouterDOC'),
  func = require('./func');


function* modifyHook(file) {
  try {
    const inputFile = process.cwd() + '/.git/hooks/prepare-commit-msg';
    const content = yield fs.readFileAsync(file);
    yield fs.writeFileAsync(inputFile, content);
    console.log('修改 ' + inputFile + ' 成功。');
  } catch (err) {
    console.log(err);
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

exports.showAction = function*() {
  try {
    var docPath = yield exists(process.cwd() + '/doc.json');
    if (docPath) {
      const doc = require(process.cwd() + '/doc.json');
      console.log(`
    查找doc.json成功!
    路径:${process.cwd()}/doc.json
    db:
    db输入目录(schemas):${doc.db.schemas}
    db文档输出路径:${doc.db.markdown.path}
    db文档输出文件名:${doc.db.markdown.file}
    api:
    api控制文件路径:${doc.api.controller}
    api输入目录(routes):${doc.api.routes}
    api文档输出路径:${doc.api.markdown.path}
    api文档输出文件名:${doc.api.markdown.file}`);
      return;
    } else {
      console.log(`找不到doc.json文件,请检查doc.json文件是否存在于项目根目录。`);
      return;
    }
  } catch (err) {
    console.log(err);
  }
};

exports.runAction = function*() {
  try {
    const docPath = yield exists(process.cwd() + '/doc.json');
    if (docPath) {
      const doc = require(process.cwd() + '/doc.json');

      doc.db.markdown.path = func.checkPath(doc.db.markdown.path);
      doc.db.schemas = func.checkPath(doc.db.schemas);
      yield craeteDb.createDOC(doc.db.schemas, doc.db.markdown);

      doc.api.markdown.path = func.checkPath(doc.api.markdown.path);
      doc.api.routes = func.checkPath(doc.api.routes);
      yield createRouter.createDOC(doc.api.controller, doc.api.routes, doc.api.markdown);
    } else {
      console.log(`找不到doc.json文件,请检查doc.json文件是否存在于项目根目录。`);
      return;
    }
  } catch (err) {
    console.log(err);
  }
};

exports.modifyhookAction = function*() {
  try {
    console.log('开始修改本地.git/hooks文件');
    const commitSamplePath = yield exists(process.cwd() + '/.git/hooks/prepare-commit-msg.sample');
    const commitPath = yield exists(process.cwd() + '/.git/hooks/prepare-commit-msg');
    if (!commitPath && !commitSamplePath) {
      console.log(`
      找不到prepare-commit-msg文件
      可能原因如下:
      1、未初始化git,.git目录不存在。
      2、prepare-commit-msg文件被修改。
      请检查项目文件!`)
    } else if (commitSamplePath) {
      yield fs.renameAsync(process.cwd() + '/.git/hooks/prepare-commit-msg.sample',
        process.cwd() + '/.git/hooks/prepare-commit-msg');
      yield modifyHook(path.resolve(__dirname, '..') + '/example/prepare-commit-msg.js');
    } else if (commitPath) {
      yield modifyHook(path.resolve(__dirname, '..') + '/example/prepare-commit-msg.js');
    }
  } catch (err) {
    console.log(err);
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
    console.log(err);
  }
}

exports.getRoutes = function*(file) {
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



