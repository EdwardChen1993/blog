const router = require('koa-router')();
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
const loginCheck = require('../middleware/loginCheck');

router.prefix('/api/blog')

router.get('/list', async function (ctx, next) {
    let {
        author = "", keyword = ""
    } = ctx.query;
    // 管理员界面
    if (ctx.query.isadmin) {
        if (ctx.session.username == null) {
            // 未登录
            ctx.body = new ErrorModel('未登录');
            return
        }
        // 强制查询自己的博客
        author = ctx.session.username;
    }
    const listData = await getList(author, keyword);
    ctx.body = new SuccessModel(listData);
})

router.get('/detail', async function (ctx, next) {
    const {
        id
    } = ctx.query;
    const data = await getDetail(id);
    ctx.body = new SuccessModel(data);
})


router.post('/new', loginCheck, async function (ctx, next) {
    const body = ctx.request.body;
    body.author = ctx.session.username;
    const data = await newBlog(body);
    ctx.body = new SuccessModel(data);
})

router.post('/update', loginCheck, async function (ctx, next) {
    const val = await updateBlog(ctx.query.id, ctx.request.body);
    ctx.body = val ? new SuccessModel() : new ErrorModel('更新博客失败');
})

router.post('/del', loginCheck, async function (ctx, next) {
    const val = await deleteBlog(ctx.query.id, ctx.session.username);
    ctx.body = val ? new SuccessModel() : new ErrorModel('删除博客失败');
})

module.exports = router