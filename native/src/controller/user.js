const {
    exec,
    escape
} = require('../db/mysql');
const {
    genPassword
} = require('../utils/cryp');

const login = (username, passsword) => {
    username = escape(username);
    passsword = escape(genPassword(passsword));
    const sql = `select username,realname from users where username=${username}and password=${passsword}`;
    return exec(sql).then(rows => {
        return rows[0] || {};
    });
}

module.exports = {
    login
}