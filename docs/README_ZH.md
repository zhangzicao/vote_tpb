# 投票吧的刷票软件

## 介绍
这个是用 react 和 eletron 建构的桌面应用。支持vote8投票吧免费投票的刷票功能，并且软件自带刷票统计和分析。

## 预览
![预览图1](/docs/assets/preview1.jpg)
![预览图2](/docs/assets/preview2.jpg)
![预览图3](/docs/assets/preview3.jpg)
![预览图4](/docs/assets/preview4.jpg)

## 目录
下面主要介绍几个重要的目录

``` bash
|-app_modules  应用APP功能模块
    |-BrushVote.js    刷票功能的实现
    |-Statistics.js    统计数据保存和获取
|-build  web页面构建目录
|-databases  数据库目录
|-dist  桌面应用的发布目录
|-public
    |-static 刷票本地测试时使用的请求返回模拟文件所在目录
```

## NPM命令

``` bash
# 下载依赖
npm install

# 开发应用，开启热替换服务器 localhost:3000
npm run start
或
npm run dev

# 构建web应用
npm run build

# 构建web应用并打印报告
npm run build --report

# 开发时使用软件窗口打开开发地址 localhost:3000
npm run electron-start

# build后使用，通过已经构建好的web页面，构建桌面应用
npm run electron-pack

# 测试
npm run test
```

## DEV

**路径确保**

为保证路径正确，package.json要确保有"homepage": "."

**开发声明**

开发时设置package.json的"DEV"为true，打包时设置为false

**开发声明**

开发时设置package.json的"DEV"为true，打包时设置为false

## PACKAGE

**asar打包**

打包为二进制时可能导致第三方读取文件路径失败，可以使用ignore忽略，并用extra-resource把文件添加到resource文件夹

**打包配置**

打包时设置package.json的"DEV"为false