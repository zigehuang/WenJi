var async = require('async');
var News = require('../data/models/news');
var Comments = require('../data/models/comments');
module.exports = function(app){
    //新闻主界面
    app.get('/news',function(req,res,next){
        async.parallel([
            function(next){
                News.count(next);
            },
            function(next){
                News.find({})
                .sort({ID:1})
                .exec(next);
            }
        ],
        function(err,results){
            if(err) return next(err);
            var news = results[1];
            res.render('news/index',{
                news:news
            });
        }
        );
    });
    //新闻详情
    app.get('/news:ID',function(req,res,next){
        var id = req.new.ID;
        var comments = 
                Comments.find({newsID:id})
                .sort({'time':-1});
        res.render('news/newsDetail',{ new:req.new,
            comments:comments});
    });
    //创建新闻
    app.get('/news/create',function(req,res,next){
        res.render('news/new');
    });
    //提交新建的新闻
    app.post('/news',function(req,res,next){
        News.create(req.body,function(err){
            if(err){
                if(err.code===11000){
                    res.send('Conflict',409);
                } else {
                    next(err);
                }
                return ;
            }
            res.redirect('/news');
        });
    });
    //删除新闻路由
    app.del('/news:ID',function(req,res,next){
        req.new.remove(function(err){
            if(err){
                return next(err);
            }
            res.redirect('/news');
        });
    });
}