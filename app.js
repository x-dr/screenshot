import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import Router from 'koa-router'; // 引入koa-router
import getImg from './screenshot.js';



const app = new Koa();
const router = new Router();
app.use(bodyParser());

router.get('/', async (ctx) => {
    ctx.body = 'ban';
});

router.all('/iurl', getImg); // 此处传递正确导入的 getImg 函数





// 使用路由中间件
app.use(router.routes()).use(router.allowedMethods());
const port = process.env.PORT || 7802;
app.listen(port, '0.0.0.0', () => {
    console.log(`Server is running at http://127.0.0.1:${port}`);
});