var express = require('express');
var router = express.Router();

//user 的mongoose model
var userModel = require('../models/user');

//sha1 用于密码加密
const sha1 = require('sha1')

//multer path fs 用于处理头像上传
const multer  = require('multer')
var upload = multer({ dest: './public/avatars/'}) //上传处理中间件 会把文件挂载在req.file或files中
const path = require('path')
const fs = require('fs')

const checkMiddlewire = require('../middlewires/check');

//添加请求日志
router.use('/', function(req, res, next) {
    console.log('[express]: Request URL:', req.originalUrl);
    next();
}, function (req, res, next) {
    console.log('[express]: Request Type:', req.method);
    next();
}
);

router.get('/create',checkMiddlewire.checkNotLogin, (req,res) => {
    res.render('createUser')
})

router.get('/login',checkMiddlewire.checkNotLogin, (req, res) => {
    // if(req.session.user) {  //如果已经登录， 重定向回之前的界面
    //     req.flash('success', "已经登录")
    //     return res.redirect('back')
    // }
    res.render('login')
})

router.post('/login',checkMiddlewire.checkNotLogin,(req, res)=> {
    var longMaxAge = req.body.remember;
    var user = {
        email: req.body.email,
        password: sha1(req.body.password)
    }

    userModel.findOne(user, (err, userFounded) => {
        if(err) {
            req.flash('error', err);
            res.redirect('back')
        } else if(userFounded) {
            //删除密码等敏感信息
            delete userFounded.password
            req.session.user = userFounded
            if(longMaxAge) {
                req.session.cookie.maxAge = 24 * 60 * 60 * 1000  //时长1天
            }
            req.flash('success', "登陆成功")
            res.redirect('/')
        } else {
            req.flash('error', "账号或者密码错误");
            res.redirect('back')
        }
    })
})

router.get('/logout', checkMiddlewire.checkLogin, (req, res) => {
    req.session.user = null
    req.session.userName = null
    req.flash("success", "登出成功")
    res.redirect('/')
})

router.post('/create', checkMiddlewire.checkNotLogin, upload.single('avatar'), (req, res) => {
    var longMaxAge = req.body.remember;
    let email = req.body.email
    let username = req.body.username
    let password = req.body.password
    let avatar = req.file
    try{
        if(!avatar) {
            throw new Error('头像不能为空')
        }
        if(!email.length) {
            throw new Error('邮箱不能为空')
        }
        if(!username.length) {
            throw new Error('名字不能为空')
        }
        if(!password.length) {
            throw new Error('密码不能为空')
        }
    } catch(err) {
        //如果注册失败 删除上传的头像
        if(avatar) {
            fs.unlink(avatar.path)
        }
        req.flash('error', err.message);
        return res.redirect('back')
    }

    let newUser = {
        email:email,
        username: username,
        password: sha1(password),
        //用path从separator分离成arrary, 仅存储文件名 
        avatar: avatar.path.split(path.sep).pop(0) 
    }

    userModel.create(newUser, (err, user) => {
        if(err) {
            fs.unlink(avatar.path)
            req.flash('error', "邮箱或用户名已存在")
            return res.redirect('back')
        } else {
            //删除密码等敏感信息后讲user存入session中
            delete user.password
            req.session.user = user
            //记住
            if(longMaxAge) {
                req.session.cookie.maxAge = 24 * 60 * 60 * 1000  //时长1天
            }
            req.flash('sucess', "创建成功")
            res.redirect('/')
        }
    })
});

module.exports = router;