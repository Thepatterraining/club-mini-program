# 校园社团管理小程序使用方法

## 安装必备工具

安装 node,mysql,微信 web 开发者工具

## 后台

到 back 目录

    cd ./back

修改 database/config.json 文件

    {
        "host": "127.0.0.1",
        "port": 3306,
        "username": "root",   //用户名
        "password": "123456", //密码
        "database": "club",  //数据库名
        "dialect": "mysql"  //数据库类型
    }

打开 mysql，创建 `club` 数据库

回到 back 目录下运行如下命令

    npm i  //安装依赖
    npm run migration //执行数据库迁移
    npm run seed //插入admin用户
    npm run start //开启后台进程
    pm2 log  //查看日志

## 前台

使用微信 web 开发者工具打开 front 文件，需要在开发者工具中启用不校验合法域名选项

    点击设置 -> 项目设置 -> 勾上不校验合法域名
