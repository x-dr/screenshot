import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import Router from 'koa-router'; // 引入koa-router
import getImg from './screenshot.js';



const app = new Koa();
const router = new Router();
app.use(bodyParser());

router.all('/iurl', getImg)


router.get('/', async (ctx) => {
    ctx.body = 'ban';
});


// 使用路由中间件
app.use(router.routes()).use(router.allowedMethods());
const port = process.env.PORT || 7802;
app.listen(port, '0.0.0.0', () => {
    console.log(`Server is running at http://127.0.0.1:${port}`);
});