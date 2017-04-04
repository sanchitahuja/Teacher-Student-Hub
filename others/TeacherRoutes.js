
var express = require('express');
var mysql = require('mysql');
var bodyparser=require('body-parser');
var Router = express.Router();
var urlencodeParser=bodyparser.urlencoded({extended:false});
var pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "root",
    database: "std_database"
});
var data = null;
var datadetails = null;
console.log("In teacher routes");

Router.post('/', urlencodeParser, function (req, res) {
    var post = req.body;
    // checking got something in the post or not
    if (!post) {
        res.render('my');
        console.log("post IS empty");
    }// if got creating pool sql connection 
    else {
        console.log("post isnt empty");
        console.log(post.UserName);
        console.log(post.Password);
        
        pool.getConnection(function (err, con) {
            con.query("SELECT * from TeacherUUID where teacherUserName =? AND Password=? ",
                [post.UserName, post.Password], function (err, results, rows) {
                    if (err)
                        console.log(err);
                    else {
                        // if nothing is found inthe databse returnning simple tect to client 
                        if (rows.length() == 0) {
                            res.send("Not Found");
                        }
                        else {// if matched data isfound stiring deatils in data and creating session user id 
                            if (rows[0].teacherUserName == post.UserName) {
                                req.session.user_id = rows[0].teacherUUID;
                                data = {
                                    UserName: rows[0].teacherUserName,
                                    UUID: rows[0].teacherUUID,
                                }
                            }

                        }

                    }

                });

        });
    }
    if (data != null) {
        pool.getConnection(function (err, con) {
            con.query("SELECT * FROM " + data[UserName] + "Details", function (err, results, rows) {
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
        res.render('TeacherUserPage',datadetails);
    }

});
module.exports=Router;

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

