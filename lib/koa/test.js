const Koa = require('./like-koa');
const app = new Koa();

// x-response-time
app.use(async (ctx, next) => {
    console.log('洋葱圈第一层开始');
    const start = new Date();
    await next();
    const ms = new Date() - start;
    console.log('洋葱圈第一层结束');
});

// logger
app.use(async (ctx, next) => {
    console.log('洋葱圈第二层开始');
    const start = new Date();
    await next();
    const ms = new Date() - start;
    console.log('洋葱圈第二层结束');
});

// response
app.use(ctx => {
    console.log('洋葱圈第三层开始');
    ctx.body = 'Hello World';
    console.log('洋葱圈第三层结束');
});

app.listen(3000);