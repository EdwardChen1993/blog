const querystring = require('querystring');
const {
    get,
    set
} = require('./src/db/redis');
const {
    access
} = require('./src/utils/log');
const handleBlogRouter = require('./src/router/blog');
const handleUserRouter = require('./src/router/user');

const SESSION_DATA = {};

// 用于处理postdata
function getPostData(req) {
    return new Promise((resolve, reject) => {
        if (req.method !== 'POST') {
            return resolve({});
        }
        if (req.headers['content-type'] !== 'application/json') {
            return resolve({});
        }
        let postData = '';
        req.on('data', chunk => {
            postData += chunk.toString();
        })
        req.on('end', function () {
            if (postData === '') {
                return resolve({});
            }
            resolve(JSON.parse(postData))
        })
    });
}

// 获取cookie过期时间
const getCookieExpires = () => {
    const d = new Date();
    d.setTime(d.getTime() + 24 * 60 * 60 * 1000);
    return d.toGMTString();
}

const serverHandle = (req, res) => {
    //记录access log
    access(`${req.method} -- ${req.url} -- ${req.headers['user-agent']} -- ${Date.now()}`)

    // 设置返回格式JSON
    res.setHeader('Content-type', 'application/json');
    // 获取path
    req.path = req.url.split('?')[0];
    // 解析query
    req.query = querystring.parse(req.url.split('?')[1]);

    // 解析cookie
    req.cookie = {};
    const cookieString = req.headers.cookie || '';
    cookieString.split(';').forEach(item => {
        if (!item) {
            return;
        }
        const [key, value] = item.split('=');
        // eval(`req.cookie.${key} = ${value}`)
        req.cookie[key.trim()] = value;
    });

    // 解析session
    // let needSetCookie = false;
    // let userId = req.cookie.userid;
    // if (userId) {
    //     if (!SESSION_DATA[userId]) {
    //         SESSION_DATA[userId] = {};
    //     }
    // } else {
    //     needSetCookie = true;
    //     userId = `${Date.now()}_${Math.random()}`;
    //     SESSION_DATA[userId] = {};
    // }
    // req.session = SESSION_DATA[userId];

    // 解析 session （使用 redis）
    let needSetCookie = false
    let userId = req.cookie.userid
    if (!userId) {
        needSetCookie = true
        userId = `${Date.now()}_${Math.random()}`
        // 初始化 redis 中的 session 值
        set(userId, {})
    }
    // 获取 session
    req.sessionId = userId;
    get(req.sessionId).then(sessionData => {
        if (sessionData == null) {
            // 初始化 redis 中的 session 值
            set(req.sessionId, {})
            // 设置 session
            req.session = {}
        } else {
            // 设置 session
            req.session = sessionData
        }
        // console.log('req.session ', req.session)

        // 处理 post data
        return getPostData(req)
    }).then((postData) => {
        req.body = postData;
        // 处理blog路由
        const blogResult = handleBlogRouter(req, res);
        if (blogResult) {
            blogResult.then(blogData => {
                if (needSetCookie) {
                    res.setHeader('Set-Cookie', `userid=${userId}; path=/; httpOnly; expires=${getCookieExpires()}`);
                }
                res.end(JSON.stringify(blogData));
            })
            return;
        }

        // 处理user路由
        const userResult = handleUserRouter(req, res);
        if (userResult) {
            userResult.then(userData => {
                if (needSetCookie) {
                    res.setHeader('Set-Cookie', `userid=${userId}; path=/; httpOnly; expires=${getCookieExpires()}`);
                }
                res.end(JSON.stringify(userData));
            })
            return;
        }

        // 未命中路由返回404
        res.writeHead(404, {
            'Content-type': 'text/plain'
        });
        res.write('404 Not Found\n');
        res.end();
    })
}

module.exports = serverHandle;