const env = process.env.NODE_ENV; // 环境变量

// 配置
let MYSQL_CONF;
let REDIS_CONF;

if (env === 'development') {
    MYSQL_CONF = {
        host: "localhost",
        user: 'root',
        password: 'zhandi34',
        port: '3306',
        database: 'blog'
    }
    REDIS_CONF = {
        host: "localhost",
        port: "6379"
    }

} else if (env === 'production') {
    MYSQL_CONF = {
        host: "localhost",
        user: 'root',
        password: 'zhandi34',
        port: '3306',
        database: 'blog'
    }
    REDIS_CONF = {
        host: "localhost",
        port: "6379"
    }
}

module.exports = {
    MYSQL_CONF,
    REDIS_CONF
}