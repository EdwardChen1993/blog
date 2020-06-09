const xss = require('xss');
const {
    exec
} = require('../db/mysql');

const getList = (author, keyword) => {
    let sql = `select * from blogs where 1=1 `;
    if (author) {
        sql += `and author = '${author}' `;
    }
    if (keyword) {
        sql += `and title like '%${keyword}%' `;
    }
    sql += `order by createtime desc;`
    return exec(sql);
}

const getDetail = id => {
    let sql = `select * from blogs where id=${id}`;
    return exec(sql).then(rows => rows[0]);
}

const newBlog = (blogData = {}) => {
    // blogData是一个博客对象，包含title、content属性
    let {
        title,
        content,
        author
    } = blogData;
    title = xss(title);
    content = xss(content);
    const createtime = Date.now();
    const sql = `insert into blogs (title, content, author, createtime) values ('${title}', '${content}', '${author}', '${createtime}')`;
    return exec(sql).then(insertData => ({
        id: insertData.insertId
    }));
}

const updateBlog = (id, blogData = {}) => {
    // blogData是一个博客对象，包含title、content属性
    let {
        title,
        content,
    } = blogData;
    title = xss(title);
    content = xss(content);
    const sql = `update blogs set title='${title}', content='${content}' where id=${id}`;
    return exec(sql).then(updateData => {
        return updateData.affectedRows > 0;
    });
}

const deleteBlog = (id, author) => {
    // id是删除博客的id
    const sql = `delete from blogs where id=${id} and author='${author}'`;
    return exec(sql).then(deleteData => {
        return deleteData.affectedRows > 0;
    });
}

module.exports = {
    getList,
    getDetail,
    newBlog,
    updateBlog,
    deleteBlog
}