一款自动化生成文档工具

## 简介

工具可以自动化生成数据库和API接口的markdown文档，并通过修改git hooks，使项目的每次commit都会自动更新文档。

## 安装

 `npm i createDOC -g`

## 配置
 - 在项目根目录使用`createDOC init`命令初始化，该命令会在当前目录创建`doc.json`文件。
 - 生成`doc.json`文件后，需要详细配置数据库schemas存储路径(目前只支持关系型数据库)，以及路由控制文件，以及子路由目录。
 - API注释规则，遵循TJ大神dox规范，简化版规则如下

 ```js
 /**
 * API description
 *
 * @param {type} name/name=default_value description 
 * @return {String} description
 * @example
 *     any example
 *     
 * @other description
 */
 ```

*ps: 此工具为内部使用工具，如个人使用可下载源码，做简单修改即可*
## 使用

```sh
  Usage: createDOC [options] [command]

  Commands:

    init         初始化当前目录doc.json文件
    show         显示配置文件状态
    run          启动程序
    modifyhook   修改项目下的hook文件
    *

  Options:

    -h, --help     output usage information
    -V, --version  output the version number

  Examples:

    $ createDOC --help
    $ createDOC -h
    $ createDOC show
```

## 示例说明
doc.json示例
```json
{
    "db": {
        "schemas": "/Users/mac/Desktop/testssss/schemas",
        "markdown": {
            "path": "/Users/mac/Desktop/testssss/doc1/",
            "file": "db.md"
        }
    },
    "api": {
        "controller": "/Users/mac/Desktop/testssss",
        "routes": "/Users/mac/Desktop/testssss",
        "markdown": {
            "path": "/Users/mac/Desktop/testssss/doc1",
            "file": "api.md"
        }
    }
}
```
schema.js示例
```js
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
api注释示例
```js
/**
   * 获取多个课程
   * @param {Number} examinationId 考试类型
   * @param {Number} subjectId 科目类型
   * @param {Number} statusId=3 状态类型
   * @param {String} startDate 更新开始时间
   * @param {String} endDate 更新结束时间
   * @param {String} keyword 关键词
   * @param {Number} page 页码
   * @return {Array} ok
   * @example [1,2,3,3,4]
   */
getCourses(req, params) {
		... ...
}
```
## TODO
1. 代码逻辑优化，适应力更强。
2. 代码速度、质量优化。
3. 加入单元测试

[github地址](https://github.com/a1511870876/buildDOC)