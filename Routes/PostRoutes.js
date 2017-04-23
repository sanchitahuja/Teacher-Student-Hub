/**
 * Created by pramo on 10-04-2017.
 */
var express=require('express');
var mysql=require('mysql');
var shortid = require('shortid');
var Router=express.Router();
var bodyparser = require('body-parser');
var urlencodeParser = bodyparser.urlencoded({ extended: false });
var cookiesession = require('cookie-session');
Router.use(cookiesession({
    cookieName: 'session',
    keys: ['hello']
}));
var pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "root",
    database: "std_database"
});
var Postpool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "root",
    database: "Post"
});
Router.post('/CreatePost',urlencodeParser,function (req,res) {
   if(req.session){
    if(req.body){
        var postdata=req.body.message;
        var sqldata={
            PostID:shortid.generate(),
            PostData:postdata,
            PosterID:req.session.userid
        }
        Postpool.getConnection(function (err,conn) {
            if(err)
                console.log(err);
           conn.query("Insert Into PostData set ?",sqldata,function (err,results,fields) {
               if(err)
                   console.log(err);
           });
            conn.query("Create Table "+sqldata.PostID+"Comments (PosterID varchar (10) PRIMARY KEY, CommentData varchar(50)",function (err,results,fields) {
               if(err)
                   console.log(err);
            });
        });
    }
       else{
        console.log("Post is Empty");
    }

   }
    else{
       console.log("Session expired");
       Router.render('my');
   }
});
Router.post('/comment',urlencodeParser,)
