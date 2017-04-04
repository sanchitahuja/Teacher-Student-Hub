
var express = require('express');
var mysql = require('mysql');
var Router = express.Router();
var NodeSession = require('node-session');
session = new NodeSession({secret: 'Q3UBzdH9GEfiRCTKbi5MTPyChpzXLsTD'});
// Router.use(express.cookieParser());
var bodyparser = require('body-parser');

var jsonparser = require('json-parser');
// var session = new NodeSession({secret: 'Q3UBzdH9GEfiRCTKbi5MTPyChpzXLsTD'});
session.startSession(req, res, callback);

var urlencodeParser = bodyparser.urlencoded({ extended: false });
var pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "root",
    database: "std_database"
});
var data = null;

console.log("In teacher routes");
//Router.use(require('connect').bodyParser());
Router.post('/redirect', urlencodeParser, function (req, res) {

 if (req.session) {
     var datadetails = null;
     var UserName=req.session.get("userid");
        pool.getConnection(function (err, con) {
            con.query("SELECT * FROM " + UserName + "Details", function (err, results, rows) {
                datadetails = {
                    UniqueID: rows[0].UUID,
                    UserName: rows[0].UserName,
                    Contact: rows[0].Contact,
                    Email: rows[0].Email,
                    DOB: rows[0].DOB,
                    ImgURL: rows[0].ImgURL
                }
            });

        });
        res.render('TeacherUserPage', datadetails);
    }
    else {
        res.render('my');
    }

});


Router.post('/', urlencodeParser, function (req, res) {

    var postdata = req.body;

    // checking got something in the post or not
    if (!req.body) {
        res.render('my');
        console.log("post IS empty");
    }// if got creating pool sql connection 
    else {

        console.log(postdata.UserName);

        pool.getConnection(function (err, con) {
            con.query("SELECT * from TeacherUUID where teacherUserName =? AND Password=? ",
                [postdata.UserName, postdata.Password], function (err, results, rows) {
                    if (err)
                        console.log(err);
                    else {
                        // if nothing is found inthe databse returnning simple tect to client 
                        if (results.length == 0) {
                            console.log("Not found username");
                            cosole.log(rows);
                            res.setHeader('Content-Type', 'application/json');
                            res.send(JSON.stringify({ "Exist": "No","URL":"/" }));
                        }
                        else {// if matched data isfound stiring deatils in data and creating session user id 
                            console.log("username found");
                            console.log("post data username "+postdata.UserName);
                            console.log(results);
                            if (results[0].teacherUserName == postdata.UserName) {
                                    // Router.use(session({
                                    //     secret: 'how-you-doin',
                                    //     resave: true,
                                    //     saveUninitialized: true
                                    // }));
                                console.log("condition verified");
                                console.log("row "+results[0].teacherUserName);
                                req.session.put("userid",results[0].teacherUserName);
                                // req.session.userid = results[0].teacherUserName;
                                console.log("Session user_id set");
                                data = {
                                    UserName: results[0].teacherUserName,
                                    UUID: results[0].teacherUUID,
                                }
                                console.log("Data values set");
                                res.status(200);
                                console.log("Status sent");
                               res.send(JSON.stringify({ "Exist": "Yes","URL":"/TeacherLogin/redirect" }));
                               console.log("data sent to Agular");
                            }

                        }

                    }

                });

        });
    }
});
   
module.exports = Router;
/***********************
// Router.post('/TeacherDetails', urlencodeParser, function (req, res) {
//     var id = req.session.user_id;
//     if (id == datadetails.UniqueID) {
//         res.json(datadetails);
//     }
//     else {
//         res.status(404).send('Not_Found');
//     }
// }
// );


*********************/




















// if (!req.body)
//     res.render('my');
// else {
//     pool.getConnection(function (err, con) {
//         con.query("SELECT teacherUserName,teacherUUID from TeacherUUID where teacherUserName =? AND Password=? ",
//             [req.body.UserName, req.body.Password], function (err, results, rows) {
//                 if (err)
//                     console.log(err);
//                 else {
//                     if (rows.length() == 0) {

//                     }
//                     else {
//                         res.redirect()
//                     }

//                 }


//             }
//         )

//     });

