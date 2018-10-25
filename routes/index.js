var express = require('express');
var router = express.Router();
//database model
const userModel = require('../models/user')
const articleModel = require('../models/article')


//如何知道多个异步函数何时全部执行完毕？ 使用Promise.all()
router.get('/', (req, res) => {
    articleModel.find({}).sort({_id: -1}).exec((err, articles) => {
        if(err) return next(err)
        
        //用于把新建的异步Promise装起来等待Promise.All 
        let promises = [];
        //此处用for of 会有奇怪的bug 暂时没搞懂为什么
        articles.forEach(article => {
            //把生成的Promise对象丢到promises里等待处理
            promises.push(new Promise((resolve, reject) => {
                //findOne返回的是user对象， find 返回的是user对象的array
                console.log(article.author)
                userModel.findOne({username: article.author}, (err, user) => {
                    if(err) {
                        // reject(err); 因为这几个任务互相独立 就不要reject了 防止一个头像没找到 其他都不找了
                        article.authorAvatar = "anonymous.png";
                        resolve("Error")
                    } else if(user) {
                        article.authorAvatar = user.avatar;
                        resolve("ok");
                    } else {
                        article.authorAvatar = "anonymous.png";
                        resolve("Not found")
                    }
                })
            }))
        });
        //Promise.all只有子promise全都执行完 才会执行resolve 也就是 .then中的回调函数
        //一旦有一个子promise执行失败 停止执行其他的 直接去.catch
        
        Promise.all(promises).then(value => {
            articles.forEach(article => {
                console.log(article.authorAvatar)
            })
            res.locals.articles = articles
            res.render('index');
        })
    })
})

module.exports = router;