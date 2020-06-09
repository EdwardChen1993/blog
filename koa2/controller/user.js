const {
    exec,
    escape
} = require('../db/mysql');
const {
    genPassword
} = require('../utils/cryp');

const login = async (username, passsword) => {
    username = escape(username);
    passsword = escape(genPassword(passsword));
    const sql = `select username,realname from users where username=${username}and password=${passsword}`;
    const rows = await exec(sql);
    return rows[0] || {};
}

module.exports = {
    login
}