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

app.listen(7802, '0.0.0.0', () => {
    console.log('Server is running on port 7802');
});