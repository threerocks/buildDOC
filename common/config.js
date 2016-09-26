/**
 * Created by mac on 16/8/26.
 */
 
module.exports = {
    newInit:
    [
        {
            title:'initConfirm',
            description:'初始化createDOC,生成doc.json.确认？(y/n)  ',
            defaults: 'y'
        },
        {
            title:'defaultConfirm',
            description:'是否使用默认配置.(y/n)  ',
            defaults: 'y'
        },
        {
            title:'showConfig',
            description:'是否显示doc.json当前配置？(y/n)  ',
            defaults: 'y'
        }
    ],
    coverInit:[
        {
            title:'modifyConfirm',
            description:'doc.json已存在，初始化将覆盖文件.确认？(y/n)  ',
            defaults: 'y'
        },
        {
            title:'defaultConfirm',
            description:'是否使用默认配置.(y/n)  ',
            defaults: 'y'
        },
        {
            title:'showConfig',
            description:'是否显示doc.json当前配置？(y/n)  ',
            defaults: 'y'
        }
    ],
    initSuccess:
    '初始化 doc.json 成功, 请查看并继续详细配置。',
    docjson: 
`{
    "db": {
        "schemas": "{{schemas }}",
        "markdown": {
            "path": "{{ dbPath }}",
            "file": "{{ dbFile }}"
        }
    },
    "api": {
        "controller": "{{ controller }}",
        "routes": "{{ routes }}",
        "markdown": {
            "path": "{{ apiPath }}",
            "file": "{{ apiFile }}"
        }
    }
}`,
    showDescription:`
======= √只表示路径存在，不代表路径配置正确 =======
======= X只表示路径不存在 =======`,
    nofile:
    '找不到doc.json文件,请检查doc.json文件是否存在于项目根目录。',
    startModifyhook:
    '开始修改本地.git/hooks文件',
    nohook:`找不到prepare-commit-msg文件
    可能原因如下:
    1、未初始化git,.git目录不存在。
    2、prepare-commit-msg文件被修改。
    请检查项目文件!`,
    colors,
};