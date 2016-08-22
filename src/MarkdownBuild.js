/**
 * Created by mac on 16/8/10.
 */
const fs = require('fs');
const func = require('../common/func');

exports.build = function (tables, markdown) {
  var text = '# 数据库文档\n\n';
  const tableHeader =
    '|字段|类型|允许为空|是否主键|是否自增|说明|\n' +
    '|:---:|:---:|:---:|:---:|:---:|:---:|\n';

  //对表名字进行排序
  var tablesArray = Object.keys(tables);
  func.quickSort(tablesArray, 0, tablesArray.length - 1);

  //分别处理每个表
  for (var table of tablesArray) {
    text = text + '## ' + table + '\n';
    text += tableHeader;
    //分别处理表的每个字段
    for (var field in tables[table]) {
      text = text + '|' + field;
      //分别处理字段的每个属性
      var property = tables[table][field];
      text = text +
        '|' + func.typeTransform(property.type) +
        '|' + func.spaceToFalse(property.allowNull) +
        '|' + func.spaceToFalse(property.primaryKey) +
        '|' + func.spaceToFalse(property.autoIncrement) +
        '|' + func.spaceToFalse(property.description);
      text += '|\n'
    }
    text += '\n'
  }

  //写入文件
  fs.writeFile(markdown.path + markdown.file , text, (err) => {
    if (err) throw err;
    console.log('It\'s saved!'); //文件被保存
    return true;
  });
};


