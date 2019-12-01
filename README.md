# node-ueditor

#### 项目介绍

- nodejs版百度UEditor后端支持中间件，支持koa和express

#### 安装
 
- (c)npm install node-ueditor -D

#### 使用注意
- 建议 [下载](https://ueditor.baidu.com/website/download.html) php版本，下载资源后建议删除资源中php代码，因为会因为use顺序先进入静态资源目录从而匹配到

#### 使用
```javascript
const nodeUeditor = require('node-ueditor');
app.use(nodeUeditor({
    // 静态资源目录,因需要公开访问
    publicPath: path.resolve(__dirname, './public'),
    // php版前端配置中默认服务端地址，可在资源配置中ueditor/ueditor.config.js更改‘serverUrl’配置
    // 如果使用默认服务端地址,建议删除下载后资源中的php代码，或者此中间件在use静态资源前进行use
    serverUrl: '/ueditor/php/controller.php',
    // 可选 || 相对静态资源目录
    uploadsPath: '/baidu/',
}));


// ### 001
//koa

const Koa = require('koa');
const path = require('path');
const staticServer = require('koa-static');
const Router = require('koa-router');
const router = new Router();
const app = new Koa();


// require node-ueditor
const nodeUeditor = require('node-ueditor');

// use
app.use(nodeUeditor({
    publicPath: path.resolve(__dirname, './public'),
    serverUrl: '/ueditor/php/controller.php',
    uploadsPath: '/baidu/',
}));

app.use(staticServer(path.resolve(__dirname, './public')));


app.use(async (ctx, next) => {
    console.log('next');
    await next();
});
app.use(router.routes());
router.get('/next', async (ctx, next) => {
    ctx.body = {
        msg: 'next'
    };
});
app.listen(8032);



// ### 002
//express

const express = require('express');
const app = express();
const path = require('path');

const nodeUeditor = require('node-ueditor');
app.use(nodeUeditor({

    publicPath: path.resolve(__dirname, './public'),
    serverUrl: '/ueditor/php/controller.php',
    uploadsPath: '/baidu2/'

}));


app.use(express.static(path.resolve(__dirname, './public')));
app.use(function (req, res, next) {
    console.log('next');
    next();
});
app.get('/next', (req, res) => {
    res.send({
        msg: 'next'
    });
});

app.listen(8033);


```
