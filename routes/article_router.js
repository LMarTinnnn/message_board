var express = require('express');
var router = express.Router();
const articleModel = require("../models/article")
const checkMiddlewire = require('../middlewires/check')

router.use('/', function(req, res, next) {
    console.log('[express]: Request URL:', req.originalUrl);
    next();
}, function (req, res, next) {
    console.log('[express]: Request Type:', req.method);
    next();
}
);

router.get("/create", checkMiddlewire.checkLogin, (req, res) => {
    res.render('createArticle');
})

router.post('/create', checkMiddlewire.checkLogin, (req, res) => {
    let anonymous = req.body.anonymous;
    let title = req.body.title;
    let content = req.body.content;
    let author = req.session.user.username;

    //错误检查（按说应该放在页面上进行检查呀）
    //undefined.length 会throw error
    try {
        if (!title.length) {
          req.flash('error', '请填写标题')
          return res.redirect('back')
        }
        if (!content.length) {
          req.flash('error', '请填写内容')
          return res.redirect('back')
        }
    } catch (e) {
        req.flash('error', e.message)
        return res.redirect('back')
    }

    let articleData = {
        title: title,
        content: content,
        author: author
    }

    //设置匿名用户
    if(anonymous) {
        articleData.author = "匿名用户"
    }

    articleModel.create(articleData, (err, article) => {
        if (err) {
            return next(err);
        }
        else {
            req.flash('success', "留言成功")
            res.redirect('/')
        }
    })
})

router.get('/remove/:articleID', checkMiddlewire.checkLogin, (req, res) => {
    const articleID = req.params.articleID
    articleModel.deleteOne({ _id: articleID }).exec((err) =>{
        if(err) next(arr);
        req.flash('success', '删除成功')
        res.redirect("back")
    })
})

module.exports = router