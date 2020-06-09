const xss = require('xss');
const {
    exec
} = require('../db/mysql');

const getList = async (author, keyword) => {
    let sql = `select * from blogs where 1=1 `;
    if (author) {
        sql += `and author = '${author}' `;
    }
    if (keyword) {
        sql += `and title like '%${keyword}%' `;
    }
    sql += `order by createtime desc;`
    return await exec(sql);
}

const getDetail = async id => {
    let sql = `select * from blogs where id=${id}`;
    const rows = await exec(sql);
    return rows[0];
}

const newBlog = async (blogData = {}) => {
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
    const insertData = await exec(sql);
    return {
        id: insertData.insertId
    };
}

const updateBlog = async (id, blogData = {}) => {
    // blogData是一个博客对象，包含title、content属性
    let {
        title,
        content,
    } = blogData;
    title = xss(title);
    content = xss(content);
    const sql = `update blogs set title='${title}', content='${content}' where id=${id}`;
    const updateData = await exec(sql);
    return updateData.affectedRows > 0;
}

const deleteBlog = async (id, author) => {
    // id是删除博客的id
    const sql = `delete from blogs where id=${id} and author='${author}'`;
    const deleteData = await exec(sql);
    return deleteData.affectedRows > 0;
}

module.exports = {
    getList,
    getDetail,
    newBlog,
    updateBlog,
    deleteBlog
}