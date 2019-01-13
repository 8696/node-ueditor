const Koa = require('koa');
const path = require('path');
const staticServer = require('koa-static');
const Router = require('koa-router');

const router = new Router();

const app = new Koa();

app.use(staticServer(path.resolve(__dirname, '../public')));
const main = require('../main');

app.use(main({

    publicPath: path.resolve(__dirname, '../public'),
    uploadsPath: '/upload/',
    serverUrl: '/ueditor/php/controller.php'

}));
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
app.listen(8030);

