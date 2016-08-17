#!/usr/bin/env node
var appInfo = require('./package.json');
var program = require('commander');
var fs = require('fs');
var build = require('./createDOC');
require('shelljs/global');
program.allowUnknownOption();
program.version(appInfo.version);
program.command('show')
  .description('显示当前状态')
  .action(function () {
    var docPath = fs.existsSync(process.cwd()+'/doc.json');
    if(docPath){
      var doc = require(process.cwd()+'/doc.json');
      console.log(`
    查找doc.json成功!
    路径:${process.cwd()}/doc.json
    输入(schemas路径):${doc.schemas})
    输出路径:${doc.markdown.path}
    输出文件名:${doc.markdown.file}`);
      return;
    }else {
      console.log(`找不到doc.json文件,请检查doc.json文件是否存在于项目根目录。`);
      return;
    }
  });
program.command('run')
  .description('启动程序')
  .action(function () {
    var docPath = fs.existsSync(process.cwd()+'/doc.json');
    if(docPath){
      var doc = require(process.cwd()+'/doc.json');
      build.buildDOC(doc.schemas, doc.markdown);
      console.log('markdown文档创建成功,请查看'+ doc.markdown.path + doc.markdown.file);
    }else {
      console.log(`找不到doc.json文件,请检查doc.json文件是否存在于项目根目录。`);
      return;
    }
  });
program.command('modifyhook')
  .description('修改项目下的hooks文件')
  .action(function () {
    console.log('开始修改本地.git/hooks文件');
    var commitSamplePath = fs.existsSync(process.cwd()+'/.git/hooks/prepare-commit-msg.sample');
    var commitPath = fs.existsSync(process.cwd()+'/.git/hooks/prepare-commit-msg');
    if(!commitPath && !commitSamplePath){
      console.log(`
      找不到prepare-commit-msg文件
      可能原因如下:
      1、未初始化git,.git目录不存在。
      2、prepare-commit-msg文件被修改。
      请检查项目文件!`)
    }else if(commitSamplePath){
      mv(process.cwd() + '/.git/hooks/prepare-commit-msg.sample',
        process.cwd() + '/.git/hooks/prepare-commit-msg');
      modifyHook(__dirname + '/src/prepare-commit-msg.js');
    }else if(commitPath){
      modifyHook(__dirname + '/src/prepare-commit-msg.js');
    }
  });
program.on('--help', function () {
  console.log(``);
});
program.parse(process.argv);



function modifyHook(file) {
  var writeFile = process.cwd() + '/.git/hooks/prepare-commit-msg';
  fs.readFile(file, function (err, data) {
    if(err){
      throw err;
    }else{
      fs.writeFile(writeFile, data, function (err) {
        if(err){
          throw err;
        }else {
          console.log('修改 ' + writeFile + ' 成功。')
        }
      })
    }
  })
}
