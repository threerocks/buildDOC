'use strict';

const program   = require('commander');
const appInfo   = require('./../package.json');

program.allowUnknownOption();
program.version(appInfo.version);

program
  .command('init')
  .description('初始化当前目录doc.json文件')
  .action(() => co(asyncFunc.initAction));

program
  .command('show')
  .description('显示配置文件状态')
  .action(() => co(asyncFunc.showAction));

program
  .command('run')
  .description('启动程序')
  .action(() => co(asyncFunc.runAction));

program
  .command('modifyhook')
  .description('修改项目下的hook文件')
  .action(() => co(asyncFunc.modifyhookAction));

program
  .command('*')
  .action((env) => {
    console.error('不存在命令 "%s"', env);
  });

program.on('--help', () => {
  console.log('  Examples:');
  console.log('');
  console.log('    $ createDOC --help');
  console.log('    $ createDOC -h');
  console.log('    $ createDOC show');
  console.log('');
});

program.parse(process.argv);
