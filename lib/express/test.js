const express = require('./like-express');

const app = express();

app.use((req, res, next) => {
    console.log('请求开始');
    next();
})

app.use((req, res, next) => {
    req.cookie = {
        userId: 123
    }
    next();
})

app.use('/api', (req, res, next) => {
    console.log('/api路由');
    next();
})

function loginCheck(req, res, next) {
    setTimeout(() => {
        console.log('loginCheck');
        next();
    }, 1000);
}

app.get('/api/get-cookie', loginCheck, (req, res, next) => {
    console.log('/api/get-cookie路由');
    res.json({
        errno: 0,
        data: req.cookie
    })
})

app.listen(8888, () => {
    console.log('listen: 8888');
})