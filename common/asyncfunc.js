const Promise = require('bluebird'),
  fs = Promise.promisifyAll(require('fs')),
  path = require('path'),
  co = require('co'),
  handlebars = require('handlebars'),
  mkdirp = require('mkdirp'),
  dox = require('dox');

const craeteDbDoc = require('./../src/createDbDOC'),
  createApiDoc = require('./../src/createApiDOC'),
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
        console.log(config.colors.rainbow('======= doc.json ========'));
        console.log(content);
        console.log(config.colors.rainbow('==== 请继续配置详细路径 ===='));
        console.log('');
        break;
      default:
        break;
    }
  }
}
function* mkdirs(str, path) {
  var pathname = config.colors.red(path);
  if (Array.isArray(path)) {
    if (path.length === 2) {
      pathname = config.colors.red(path[0]) + ' 和 ' + config.colors.red(path[1]);
    } else {
      return;
    }
  }
  process.stdout.write(config.colors.red(str) + '输出目录' + pathname + '不存在，是否创建 (y/n):');
  process.stdin.resume();
  process.stdin.setEncoding('utf-8');
  process.stdin.on('data', (chunk) => {
    co(function* () {
      chunk = chunk.replace(/[\s\n]/, '');
      if (chunk !== 'y' && chunk !== 'Y' && chunk !== 'n' && chunk !== 'N') {
        console.log(config.colors.red('您输入的命令是： ' + chunk));
        console.warn(config.colors.red('请输入正确指令：y/n'));
        process.exit();
      }
      process.stdin.pause();
      if (chunk === 'y' || chunk === 'Y') {
        if (Array.isArray(path)) {
          yield mkdir(path[0]);
          console.log(config.colors.red(path[0]) + '创建成功');
          yield mkdir(path[1]);
          console.log(config.colors.red(path[1]) + '创建成功');
          process.exit();
        }
        yield mkdir(path)
        console.log(config.colors.red(path) + '创建成功');
        process.exit();
      } else if (chunk === 'n' || chunk === 'N') {
        process.exit();
      }
    });
  });
}

function* modifyHook(file) {
  try {
    const inputFile = process.cwd() + '/.git/hooks/prepare-commit-msg';
    const content = yield fs.readFileAsync(file);
    yield fs.writeFileAsync(inputFile, content);
    console.log('修改 ' + config.colors.red(inputFile) + ' 成功。');
  } catch (err) {
    console.warn(err);
  }
}

function exists(file) {
  return new Promise((resolve, reject) => {
    fs.exists(file, (exists) => {
      if (!exists) resolve(exists);
      resolve(exists);
    });
  });
}
function mkdir(path) {
  return new Promise((resolve, reject) => {
    mkdirp(path, (err) => {
      if (err) reject(err);
      else resolve()
    })
  })
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

      console.log(config.colors.rainbow(config.showDescription));
      console.log(config.colors.red(`
${docPath ? '√' : 'X'}`) + `   doc.json -> ${process.cwd()}/doc.json
`);
      console.log('  db:');
      console.log(config.colors.red(`${dbSchemas ? '√' : 'X'}`) + `   输入 <- ${doc.db.schemas}`);
      console.log(config.colors.red(`${dbMarkdownPath ? '√' : 'X'}`) + `   输出 -> ${doc.db.markdown.path}${doc.db.markdown.file}`);
      console.log('  api:');
      console.log(config.colors.red(`${apiController ? '√' : 'X'}`) + `   控制 <- ${doc.api.controller}`)
      console.log(config.colors.red(`${apiMarkdownPath ? '√' : 'X'}`) + `   输入 <- ${doc.api.routes}`)
      console.log(config.colors.red(`${apiRouters ? '√' : 'X'}`) + `   输出 -> ${doc.api.markdown.path}${doc.api.markdown.file}`);
      console.log('');
      if (!dbMarkdownPath && apiMarkdownPath) {
        yield mkdirs('db ', doc.db.markdown.path);
      }
      if (!apiMarkdownPath && dbMarkdownPath) {
        yield mkdirs('api ', doc.api.markdown.path);
      }
      if (!apiMarkdownPath && !dbMarkdownPath) {
        yield mkdirs('db 和 api ', [doc.db.markdown.path, doc.api.markdown.path]);
      }
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
      //yield craeteDbDoc.createDOC(doc.db.schemas, doc.db.markdown);
      // 处理api文档
      doc.api.markdown.path = func.checkPath(doc.api.markdown.path);
      doc.api.routes = func.checkPath(doc.api.routes);
      yield createApiDoc.createDOC(doc.api.controller, doc.api.routes, doc.api.markdown);
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
      console.log(config.colors.red(nfig.nohook));
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

exports.buildDoxObjs = function* (routes, files) {
  var doxObjs = [];
  var count = 0;
  for (var file of files) {
    var code = yield fs.readFileAsync(file, 'utf-8');
    doxObjs = doxObjs.concat(dox.parseComments(code));
    count++;
    if (count === files.length) {
      return filterObj(routes, doxObjs);
    }
  }
}

function filterObj(routes, doxObjs) {
  var pureObjArr = {};
  doxObjs.map((obj) => {
    var key = '';
    var value = {};
    if (obj.ctx) {
      var params = [];
      key = obj.ctx.name.replace(/[\*]/, '');
      value.type = obj.ctx.type;
      value.description = obj.description.full;
      if (obj.tags && Array.isArray(obj.tags)) {
        for (var tag of obj.tags) {
          if (tag.type === 'param') {
            var param = {};
            if (/\=/.test(tag.name)) {
              var name = tag.name.split('=');
              tag.name = name[0];
              tag.defaultValue = name[1];
            }
            param.name = tag.name || '';
            param.defaultValue = tag.defaultValue || '';
            param.description = tag.description || '';
            param.type = (tag.types && Array.isArray(tag.types)) ? tag.types.join(' ') : '';
            params.push(param)
            value.param = params;
          } else if (tag.type === 'example') {
            value.example = tag.html || '';
          } else if (tag.type === 'return') {
            var returnValue = {};
            returnValue.description = tag.description || '';
            returnValue.type = (tag.types && Array.isArray(tag.types)) ? tag.types.join(' ') : '';
            value.returnValue = returnValue;
          } else {
            var other = tag.type;
            value[other] = tag.string || '';
          }
        }
      }
      pureObjArr[key] = Object.assign(value, routes[key]);
    }
  });
  return pureObjArr;
}


