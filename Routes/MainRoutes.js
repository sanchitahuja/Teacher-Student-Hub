var express = require('express');
var Router = express.Router();
var mysql = require('mysql');
var BatchRoutes=require('./BatchRoutes.js');
var cookiesession = require('cookie-session');
// var cookieParser=require('cookie-parser');
var bodyparser = require('body-parser');
Router.use('/Batch',BatchRoutes);
Router.use(cookiesession({
    cookieName: 'session',
    keys: ['hello']
}));
// var RedisStore = require('connect-redis')(session);
// var redis = require('redis');
// var client = redis.createClient(6379, 'localhost');
// Router.use(express.cookieParser());
// Router.use(cookiesession({
//     cookieName: 'session',
//     secret: 'hello',
//     cookie:{},
//     resave: false,
//     saveUninitialized: false,
//     store: new RedisStore({
//         host: 'localhost',
//         port: 3306,
//         db:1,
//         pass: 'root'
//
//     }),
//     secret: '1234567890QWERTY'
// }));
var urlencodeParser = bodyparser.urlencoded({ extended: false });
var data = null;
var datadetails=null;
// Router.set('trust-proxy');
// Router.use(cookieParser('hello'));
// Router.use(session({
//     cookieName: 'session',
//     secret: 'hello',
//     cookie:{},
//     resave: false,
//     saveUninitialized: false,
//     // duration: 30 * 60 * 1000,
//     // activeDuration: 5 * 60 * 1000,
//
// }));
Router.get('/redirect',function(req,res){
    console.log("got request to redirect");
    if(req.session==null)
    console.log("req session is null");
    if(req.session!=null){
        console.log("Session is ALIVE");
        console.log("session "+JSON.stringify(req.session));
        // console.log("USER ID "+req.session.userid);
        pool.getConnection(function (err, con) {
            con.query("SELECT * FROM " + req.session.userid + "Details", function (err, results, rows) {
                datadetails = {
                    UniqueID: results[0].UUID,
                    UserName: results[0].Username,
                    Contact: results[0].Contact,
                    Email: results[0].Email,
                    DOB: results[0].DOB,
                    ImgURL: results[0].ImgURL
                }
            });

        });
        console.log("datadetials "+JSON.stringify(datadetails));
        if(req.session.type==="Teacher")
        res.render('TeacherUserpage',datadetails);
        else if(req.session.type==="Student")
            res.render('StudentUserpage',datadetails);
        else
            res.sendStatus(404);

   }
   else{ console.log("Session is dead");
        res.render('my');

   }
});

var pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "root",
    database: "std_database"
});


Router.post('/', urlencodeParser, function (req, res) {
    if (!req.body) {
        res.render('my');
        console.log("post IS empty");
    }
    else{
        var postdata = req.body;
        console.log("POst data username "+postdata.UserName);
        pool.getConnection(function (err, con) {
            if(err)
            console.log(err);
            else {
                if (postdata.selectedstate === "Teacher") {
                    con.query("SELECT * from TeacherUUID where teacherUsername   =? AND teacherPass =? ",
                        [postdata.UserName, postdata.Password], function (err, results, rows) {
                            if (err)
                                console.log(err);
                            else {
                                if (results.length === 0) {
                                    console.log("Not found username");
                                    console.log(rows);
                                    res.setHeader('Content-Type', 'application/json');
                                    res.send(JSON.stringify({"Exist": "No", "URL": "/"}));
                                }
                                else {
                                    console.log("username found");
                                    console.log("post data username " + postdata.UserName);
                                    console.log("Sql username " + results[0].teacherUsername);
                                    if (results[0].teacherUsername === postdata.UserName) {
                                        console.log("condition verified");
                                        console.log("row " + results[0].teacherUsername);
                                        req.session.type = "Teacher";
                                        req.session.userid = results[0].teacherUsername;
                                        res.status(200);
                                        console.log("Status sent");
                                        res.send(JSON.stringify({"Exist": "Yes", "URL": "/Login/redirect"}));
                                        console.log("data sent to Angular JSON DATA SENT " + JSON.stringify({
                                                "Exist": "Yes",
                                                "URL": "/Login/redirect"
                                            }));
                                    }
                                    else {
                                        console.log("Condition Failed");
                                    }

                                }
                            }


                        });
                }
                else if(postdata.selectedstate==="Student"){
                    console.log("In Stuent verification")
                    console.log("postdata "+postdata);
                    con.query("SELECT * from StudentUUID where studentUsername   =? AND studentPass =? ",
                        [postdata.UserName, postdata.Password], function (err, results, rows) {
                            if (err)
                                console.log(err);
                            else {
                                if (results.length === 0) {
                                    console.log("Not found username");
                                    console.log(rows);
                                    res.setHeader('Content-Type', 'application/json');
                                    res.send(JSON.stringify({"Exist": "No", "URL": "/"}));
                                }
                                else {
                                    console.log("username found");
                                    console.log("post data username " + postdata.UserName);
                                    console.log("Sql username " + results[0].studentUsername);
                                    if (results[0].studentUsername === postdata.UserName) {
                                        console.log("condition verified");
                                        console.log("row " + results[0].studentUsername);
                                        req.session.type = "Student";
                                        req.session.userid = results[0].studentUsername;
                                        res.status(200);
                                        console.log("Status sent");
                                        res.send(JSON.stringify({"Exist": "Yes", "URL": "/Login/redirect"}));
                                        console.log("data sent to Angular JSON DATA SENT " + JSON.stringify({
                                                "Exist": "Yes",
                                                "URL": "/Login/redirect"
                                            }));
                                    }
                                    else {
                                        console.log("Condition Failed");
                                    }

                                }
                            }


                        });

                }


            }

        });
    }





});
module.exports = Router;