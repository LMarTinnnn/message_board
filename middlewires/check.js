module.exports = {
    checkLogin: function (req, res, next) {
        if(!req.session.user) {
            req.flash('error', "未登录,无法进行相关操作");
            return res.redirect('back');
        }
        next()
    },
    checkNotLogin: (req, res, next) => {
        if(req.session.user) {
            req.falsh('error', "已经登陆，无法进行相关操作");
            return res.redirect('back')
        } 
        next();
    }
}