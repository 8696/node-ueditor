# node-ueditor

#### 项目介绍

- nodejs后端百度UEditor支持中间件，支持koa和express

#### 安装
 
- (c)npm node-ueditor -D


#### 使用
```javascript

const nodeUeditor = require('node-ueditor');
app.use(nodeUeditor({
    // 静态资源目录,因为需要公开访问
    publicPath: path.resolve(__dirname, './public'),
    // php版默认服务端地址，可在 ueditor/ueditor.config.js文件中更改‘serverUrl’配置
    serverUrl: '/ueditor/php/controller.php',
    // 可选 || 相对静态目录
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

const main = require('node-ueditor');
app.use(main({

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
