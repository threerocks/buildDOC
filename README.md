## 简介

一款自动化生成文档工具，可通过schema文件生成数据库文档，通过路由文件、接口代码、注释等生成接口文档，每次commit自动更新文档，让人专注于代码编写。目前程序初次实现，还有很多功能需要完善，许多地方需要优化。

## 安装

 `npm i createDOC -g`

## 使用

```sh
Usage: createDOC [options] [command]
    Commands:
 
    show         显示当前状态
    run          启动程序
    modifyhook   修改项目下的hooks文件
 
  Options:
 
    -h, --help     output usage information
    -V, --version  output the version number
```

**使用方法:**  

1. 在开发项目根目录使用该命令工具,在项目根目录新建`doc.json`文件,指定`schema`存储目录,和`markdown`文件输出路径,文件样例如下。
2. 使用`createDOC -h`或者`createDOC -V(大写)`来确定`createDOC`是否安装成功。
3. 单独运行程序使用`createDOC run`命令。
4. 使用`createDOC modifyhook`命令修改本地钩子文件,之后无需任何操作,项目每次`commit`文档会自动更新。
5. 使用`createDOC show`命令随时查看输入输出路径,确保输入输出路径正确。
```json
{
  "schemas":"/Users/mac/Desktop/testssss/models/",
  //schema文件目录,目前所有schema文件都需要存在此目录的根目录,暂时 TODO:不支持子目录
  "markdown": {
    "path": "/Users/mac/Desktop/",
    "file": "dbDocument.md"
  }
  //markdown文档输出目录和文件名
}
```
## 注意
1. 尽量全局安装。
2. schema文件格式,
    1. 如果文件存在`tableName`属性,表名称为`tableName`的值,否则表名称设置为当前文件名。
    2. 字段属性和值的关系必须严格遵守`key:{}`的格式,`:{`或`: {`是必须存在的标示,用于切割内容。
    3. 单行注释使用`//这是注释`。
    4. 多行注释使用`/* 这是注释*/`,切勿出现多行`//`的情况。
    5. 示例如下(注:只需要上述4条件满足,其他诸如示例前两行的`sequelize`官方格式为非必须,同时字段属性写法也无限制)。
3. 包版本更新后需要重新使用`createDOC modifyhook`命令设置本地钩子。
```javascript
module.exports = function(sequelize, DataTypes) {
   	return sequelize.define('test_zk_absence', {
   		//这是id
   		id: {
   			type: DataTypes.INTEGER,
   			allowNull: false,
   			primaryKey: true,
   			autoIncrement: true
   		},
   		//这是end_data
   		end_date: {
   			type: DataTypes.DATE,
   			allowNull: true
   		},
   		/*
   		{
   			a:1,
   			b:2,
   			c:{a:2},
   			d:'2222'
   		}
   		*/
   		type_id: {
   			type: DataTypes.INTEGER,
   			allowNull: true
   		},
   		updated_at: {
   			type: DataTypes.DATE,
   			allowNull: false
   		}
   	}, {
   		tableName: 'test_zk_absence'
   	});
   };
```
## TODO
1. 代码逻辑优化，适应力更强。
2. 代码速度、质量优化。
3. 增加路由、代码、注释文档生成功能。