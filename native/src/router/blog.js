const {
    getList,
    getDetail,
    newBlog,
    updateBlog,
    deleteBlog
} = require('../controller/blog');
const {
    SuccessModel,
    ErrorModel
} = require('../model/resModel');

// 统一的登录验证函数
const loginCheck = (req) => {
    // console.log(JSON.stringify(req.session));
    if (!req.session.username) {
        return Promise.resolve(new ErrorModel('尚未登录'));
    }
}

const handleBlogRouter = (req, res) => {
    const {
        method,
        path
    } = req;

    // 获取博客列表
    if (method === 'GET' && path === '/api/blog/list') {
        let {
            author = "", keyword = ""
        } = req.query;
        // 管理员界面
        if (req.query.isadmin) {
            const loginCheckResult = loginCheck(req);
            if (loginCheckResult) {
                // 未登录
                return loginCheckResult;
            }
            // 强制查询自己的博客
            author = req.session.username;
        }
        const result = getList(author, keyword);
        return result.then(listData => {
            return new SuccessModel(listData);
        })
    }

    // 获取博客详情
    if (method === 'GET' && path === '/api/blog/detail') {
        const {
            id
        } = req.query;
        const result = getDetail(id);
        return result.then(data => {
            return new SuccessModel(data);
        })
    }

    // 新建博客
    if (method === 'POST' && path === '/api/blog/new') {
        const loginCheckResult = loginCheck(req);
        if (loginCheckResult) {
            return loginCheckResult;
        }
        req.body.author = req.session.username;
        const result = newBlog(req.body);
        return result.then(data => {
            return new SuccessModel(data);
        })
    }

    // 更新博客
    if (method === 'POST' && path === '/api/blog/update') {
        const loginCheckResult = loginCheck(req);
        if (loginCheckResult) {
            return loginCheckResult;
        }
        const result = updateBlog(req.query.id, req.body);
        return result.then(val => {
            return val ? new SuccessModel() : new ErrorModel('更新博客失败')
        })
    }

    // 删除博客
    if (method === 'POST' && path === '/api/blog/del') {
        const loginCheckResult = loginCheck(req);
        if (loginCheckResult) {
            return loginCheckResult;
        }
        const result = deleteBlog(req.query.id, req.session.username);
        return result.then(val => {
            return val ? new SuccessModel() : new ErrorModel('删除博客失败')
        })
    }

}

module.exports = handleBlogRouter;