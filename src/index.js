const program = require('commander'),
  co = require('co');

const appInfo = require('./../package.json'),
  asyncFunc = require('./../common/asyncfunc.js');

program.allowUnknownOption();
program.version(appInfo.version);

program.command('show')
  .description('显示当前状态')
  .action(() => co(asyncFunc.showAction));
program.command('run')
  .description('启动程序')
  .action(() => co(asyncFunc.runAction));
program.command('modifyhook')
  .description('修改项目下的hook文件')
  .action(() => co(asyncFunc.modifyhookAction));

program.parse(process.argv);
