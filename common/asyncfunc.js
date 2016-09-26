'use strict';

const handlebars   = require('handlebars');
const createApiDoc = require('./../src/createApiDOC'),
      craeteDbDoc  = require('./../src/createDbDOC');  

const fs = Promise.promisifyAll(require('fs'));

//初始化新建doc.json,处理函数
const newDoc = function* (inputInfos) {
  if (!Array.isArray(inputInfos) || inputInfos.length <= 0) return;
  for (const inputinfo of inputInfos) {
    const data = {
      schemas:    '',
      dbPath:     '',
      dbFile:     '',
      controller: '',
      routes:     '',
      apiPath:    '',
      apiFile:    '',
    };
    switch (inputinfo.title) {
      case 'modifyConfirm' || 'initConfirm':
        break;
      case 'defaultConfirm': {
        const template = handlebars.compile(config.docjson);
        const result   = template(data);
        if (inputinfo.value === 'n' || inputinfo.value === 'N') {
          yield fs.writeFileAsync(process.cwd() + '/doc.json', result);
          break;
        }
        data.schemas    = './schemas/';
        data.dbPath     = './doc/';
        data.dbFile     = 'db.md';
        data.controller = './controller.js';
        data.routes     = './routes';
        data.apiPath    = './doc';
        data.apiFile    = 'api.md';
        yield fs.writeFileAsync(process.cwd() + '/doc.json', result);
        break;
      }
      case 'showConfig': {
        if (inputinfo.value === 'n' || inputinfo.value === 'N') break;
        const content = yield fs.readFileAsync(process.cwd() + '/doc.json', 'utf-8');
        console.log('');
        console.log(config.colors.rainbow('======= doc.json ========'));
        console.log(content);
        console.log(config.colors.rainbow('==== 请继续配置详细路径 ===='));
        console.log('');
        break;
      } 
      default:
        break;
    }
  }
};

const mkdir = function (path) {
  return new Promise((resolve, reject) => {
    mkdirp(path, (err) => {
      if (err) reject(err);
      else resolve();
    });      
  });
};

const mkdirs = function* (str, path) { // eslint-disable-line
  let pathname = config.colors.red(path);
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
        yield mkdir(path);
        console.log(config.colors.red(path) + '创建成功');
        process.exit();
      } else if (chunk === 'n' || chunk === 'N') {
        process.exit();
      }
    });
  });
};

const modifyHook = function* (file) {
  try {
    const inputFile = process.cwd() + '/.git/hooks/prepare-commit-msg',
          content   = yield fs.readFileAsync(file);
    yield fs.writeFileAsync(inputFile, content);
    console.log('修改 ' + config.colors.red(inputFile) + ' 成功。');
  } catch (err) {
    console.warn(err);
  }
};

const exists = function (file) {
  return new Promise((resolve, reject) => { // eslint-disable-line
    fs.exists(file, (exists) => {
      if (!exists) resolve(exists);
      resolve(exists);
    });
  });
};

exports.initAction = function* () {
  try {
    const docPath = yield exists(process.cwd() + '/doc.json');
    if (docPath) {
      func.initRepl(config.coverInit, arr => {
        co(newDoc(arr));
      });
    } else {
      func.initRepl(config.newInit, arr => {
        co(newDoc(arr));
      });
    }
  } catch (err) {
    console.warn(err);
  }
};

exports.showAction = function* () {
  try {
    const docPath = yield exists(process.cwd() + '/doc.json');
    if (docPath) {
      const doc = require(process.cwd() + '/doc.json'); // eslint-disable-line

      doc.db.markdown.path   = func.checkPath(doc.db.markdown.path);
      doc.db.schemas         = func.checkPath(doc.db.schemas);
      doc.api.markdown.path  = func.checkPath(doc.api.markdown.path);
      doc.api.routes         = func.checkPath(doc.api.routes);

      const dbMarkdownPath   = yield exists(doc.db.markdown.path),
            dbSchemas        = yield exists(doc.db.schemas),
            apiController    = yield exists(doc.api.controller),
            apiMarkdownPath  = yield exists(doc.api.markdown.path),
            apiRouters       = yield exists(doc.api.routes);

      console.log(config.colors.rainbow(config.showDescription));
      console.log(config.colors.red(`
${docPath ? '√' : 'X'}`) + `   doc.json -> ${process.cwd()}/doc.json
`);
      console.log('  db:');
      console.log(config.colors.red(`${dbSchemas ? '√' : 'X'}`) + `   输入 <- ${doc.db.schemas}`);
      console.log(config.colors.red(`${dbMarkdownPath ? '√' : 'X'}`) + `   输出 -> ${doc.db.markdown.path}${doc.db.markdown.file}`);
      console.log('  api:');
      console.log(config.colors.red(`${apiController ? '√' : 'X'}`) + `   控制 <- ${doc.api.controller}`);
      console.log(config.colors.red(`${apiRouters ? '√' : 'X'}`) + `   输入 <- ${doc.api.routes}`);
      console.log(config.colors.red(`${apiMarkdownPath ? '√' : 'X'}`) + `   输出 -> ${doc.api.markdown.path}${doc.api.markdown.file}`);
      console.log('');
      if (!dbMarkdownPath && apiMarkdownPath) {
        yield mkdirs('db ', doc.db.markdown.path);
      }
      if (!apiMarkdownPath && dbMarkdownPath) {
        yield mkdirs('api ', doc.api.markdown.path);
      }
      if (!apiMarkdownPath && !dbMarkdownPath) {
        yield mkdirs('db 和 api ', [ doc.db.markdown.path, doc.api.markdown.path ]);
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
      const doc = require(process.cwd() + '/doc.json'); // eslint-disable-line
      // 处理db文档
      doc.db.markdown.path  = func.checkPath(doc.db.markdown.path);
      doc.db.schemas        = func.checkPath(doc.db.schemas);
      yield craeteDbDoc.createDOC(doc.db.schemas, doc.db.markdown);
      // 处理api文档
      doc.api.markdown.path = func.checkPath(doc.api.markdown.path);
      doc.api.routes        = func.checkPath(doc.api.routes);
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
    const commitSamplePath = yield exists(process.cwd() + '/.git/hooks/prepare-commit-msg.sample'),
          commitPath       = yield exists(process.cwd() + '/.git/hooks/prepare-commit-msg');
    if (!commitPath && !commitSamplePath) {
      console.log(config.colors.red(config.nohook));
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
const getFiles = function* (dir) {
  try {
    let filesArr = [];
    const files = yield fs.readdirAsync(dir);
    for (const file of files) {
      const pathName = dir + file,
            info     = yield fs.statAsync(pathName);
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
};
exports.getAllFiles = getFiles;

exports.getRoutes = function* (file) {
  const request = [ 'GET', 'POST', 'PUT', 'DELETE', 'INPUT', 'TRACE', 'OPTIONS', 'HEAD'
    , 'get', 'post', 'put', 'delete', 'input', 'trace', 'options', 'head' ];
  const content = yield fs.readFileAsync(file);
  const dirtyRoutes = content.toString().match(/\[.*\]/g);
  const routes = [],
        data = {};
  for (const dirtrRoute of dirtyRoutes) {
    const result = dirtrRoute.replace(/[\[\]\s\']/g, '').split(',');
    if (request.indexOf(result[0]) > -1) {
      routes.push(result);
    }
  }
  for (const route of routes) {
    const key   = route[3],
          value = {};
    value.path   = route[1];
    value.method = route[0];
    value.group  = route[2].split('.')[1] || route[2];
    data[key] = value;
  }
  return data;
};



const filterObj = function (routes, doxObjs) {
  const pureObjArr = {};
  doxObjs.map((obj) => {
    let key = '';
    const value = {};
    if (obj.ctx) {
      const params = [];
      key = obj.ctx.name.replace(/[\*]/, '');
      value.type = obj.ctx.type;
      value.description = obj.description.full;
      if (obj.tags && Array.isArray(obj.tags)) {
        for (const tag of obj.tags) {
          if (tag.type === 'param') {
            const param = {};
            if (/\=/.test(tag.name)) {
              const name = tag.name.split('=');
              tag.name         = name[0];
              tag.defaultValue = name[1];
            }
            param.name         = tag.name || '';
            param.defaultValue = tag.defaultValue || '';
            param.description  = tag.description || '';
            param.type         = (tag.types && Array.isArray(tag.types)) ? tag.types.join(' ') : '';
            params.push(param);
            value.param = params;
          } else if (tag.type === 'example') {
            value.example = tag.html || '';
          } else if (tag.type === 'return') {
            const returnValue = {};
            returnValue.description = tag.description || '';
            returnValue.type = (tag.types && Array.isArray(tag.types)) ? tag.types.join(' ') : '';
            value.returnValue = returnValue;
          } else {
            const other = tag.type;
            value[other] = tag.string || '';
          }
        }
      }
      pureObjArr[key] = Object.assign(value, routes[key]);
    }
  });
  return pureObjArr;
};

exports.buildDoxObjs = function* (routes, files) {
  let doxObjs = [];
  let count = 0;
  for (const file of files) {
    console.log(`${count}、  正在处理${file}...`);
    const code = yield fs.readFileAsync(file, 'utf-8');
    doxObjs = doxObjs.concat(dox.parseComments(code));
    console.log(config.colors.blue('处理完毕'));
    count++;
    if (count === files.length) {
      return filterObj(routes, doxObjs);
    }
  }
};
