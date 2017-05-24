/**
 * Created by pramo on 01-05-2017.
 */
var express=require('express');
var mysql=require('mysql');
var Router=express.Router();
var shortid = require('shortid');
var bodyparser = require('body-parser');
var urlencodeParser = bodyparser.urlencoded({ extended: false });

var cookiesession = require('cookie-session');
Router.use(cookiesession({
    cookieName: 'session',
    keys: ['hello']
}));
function twoDigits(d) {
    if(0 <= d && d < 10) return "0" + d.toString();
    if(-10 < d && d < 0) return "-0" + (-1*d).toString();
    return d.toString();
}
var pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "root",
    database: "std_database"
});

Date.prototype.toMysqlFormat = function() {
    return this.getUTCFullYear() + "-" + twoDigits(1 + this.getUTCMonth()) + "-" + twoDigits(this.getUTCDate()) + " " + twoDigits(this.getUTCHours()) + ":" + twoDigits(this.getUTCMinutes()) + ":" + twoDigits(this.getUTCSeconds());
};

Router.get('/',function (req,res) {
   if(req.session&&req.session.userid){
       res.render('PortalView')
   } 
    else{
       res.render('my');
   }
});
Router.get('/getPosts',function (req,res) {
    console.log("Got req");
    if(req.session&&req.session.userid){
        var arr=[];
        pool.getConnection(function (err,con) {
            if(err)
                console.log(err);

        con.query("SELECT * FROM Posts ORDER BY Time DESC;",function (err,results,fields) {
            console.log("IN here");
            if(err)
                console.log(err);
            if(!results)
                console.log("results null");
            if(results.length<=0){
                console.log("NOthing here")
            }
            else{
                var i=0;
                for(i=0;i<results.length;i++){
                    console.log(results[i]);
                    var data={
                        "PostID":results[i].PostID,
                        "PostText":results[i].PostText,
                        "Time":results[i].Time,
                        "PosterID":results[i].PosterID
                    }
                    arr.push(data);

                }
                if(i===results.length)
                    res.send(JSON.stringify({"status":"done","Arr":arr}));
            }
        });
        });
    }

    else{
            req.session=null;
            res.render('my');
        }

});
Router.post('/getComments',urlencodeParser,function (req,res) {
   if(req.session&&req.session.userid){
        var PID=req.body.PostID;
       var Arr=[];
       pool.getConnection(function (err,con) {
          con.query("Select * from Comments where PostID="+PID+" ORDER BY Time;",function (err,results,fields) {
              for(i=0;i<results.length;i++){
                  var data={
                      "UserID":results[i].UserID,
                      "CommentText":results[i].CommentText,
                      "Time":results[i].Time,
                  }
                  Arr.push(data);

              }
              if(i===results.length)
                  res.send(JSON.stringify({"status":"done","Arr":Arr}));
          });
       });
   }
    else{
       res.render('my');
   }

});
Router.post('/Post',urlencodeParser,function (req,res) {
    if(req.session&&req.session.userid){
        pool.getConnection(function (err,con) {
            if(err)
                console.log(err);
            console.log(req.body);
        var PostID=shortid.generate();
        var PosterID=req.session.userid;

        var PostText=req.body.PostText;

        var data={
            "PostID":PostID,
            "PosterID":req.session.userid,
            "Time":new Date().toMysqlFormat(),
            "PostText":PostText
        };
        con.query("Insert INTO Posts set ?",data,urlencodeParser,function (err,results,fields) {
            if(err)
                console.log(err);
            else{
                res.send(JSON.stringify({"status":"done"}));
            }
          
        });
        });
    }
    else{
        req.session=null;
        res.render('my');
    }

});

Router.post('/comment',urlencodeParser,function (req,res) {
   if(req.session.userid){
       var PostID=req.body.PostID;
       var UserID=req.session.userid;
       var CommentText=req.body.CommentText;
       var Time='2015-12-10';
       var data={
           "PostID":PostID,
            "CommentText":CommentText,
           "Time":new Date().toMysqlFormat(),
           "UserID":UserID
       };
       // var CommentID=shortid.generate();
       pool.getConnection(function (err,con) {
          con.query("INSERT INTO Comments set ?",data,function (err,results,fields) {
              if(err)
                  console.log(err);
              else{
                  res.send(JSON.stringify({"status":"done"}));
              }
          });
       });
   }
    else{
       req.session=null;
       res.render('my');
   }
});














module.exports=Router;