/**
 * Created by pramo on 27-03-2017.
 */
var express=require('express');
var Router=express.Router();
var mysql = require('mysql');
var shortid = require('shortid');
var bodyparser = require('body-parser');
var urlencodeParser = bodyparser.urlencoded({ extended: false });

var pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "root",
    database: "std_database"
});
Router.get('/',function (req,res) {
    
    console.log("Rendering register page ");
   res.render('register'); 
});

Router.post('/req',urlencodeParser,function (req,res) {
    if(!req.body)
    {
        console.log("Rendering register page body is NULL");
        res.render('register');
    }
    else
    {
        var data =req.body;
        var Username=data.username;
        var PostContact=data.contact;
        var PostDOB=data.date;
        var Email=data.email;
        var Pass=data.password;
        var selectedstate=data.selectedstate;
        console.log("data DOB "+data.DOB);
        if(Username!=null&&PostContact!=null&&Email!=null&&Pass!=null)
        {
            console.log("Username Contact and Email Pass arent null");
            pool.getConnection(function (err,conn) {
                if (err)
                    console.log(err);
                else
                {
                    var teacherpost={
                        teacherUUID: shortid.generate(),
                        teacherUsername:Username,
                        teacherEmail:Email,
                        teacherPass:Pass

                    };
                    var studentpost={
                        studentUUID: shortid.generate(),
                        studentUsername:Username,
                        studentEmail:Email,
                        studentPass:Pass
                    };
                    console.log("TEacher uuid "+teacherpost.teacherUUID+" TEacher USername "+teacherpost.teacherUsername+" Teacher pass "+teacherpost.teacherPass);
                    if(selectedstate==="Teacher") {

                        conn.query("Select teacherUsername from TeacherUUID where teacherUsername=? or teacherEmail=? ", [Username, Email], function (error, results, fields) {
                            if (results.length === 0) {
                                console.log(results);
                                console.log("Results length is zero");
                                console.log("Selected State " + selectedstate);
                                console.log(teacherpost);
                                    conn.query("Insert into TeacherUUID set ?", teacherpost, function (err, results, field) {
                                        if (err)
                                            console.log(err);
                                        else {
                                            console.log("Results "+results[0]);
                                            console.log("No error in Teacher insert and status sent done");
                                            console.log("username "+Username);
                                            conn.query("create table "+Username+"Details(UUID varchar(20) unique,Username varchar(50) unique,Contact varchar(20),Email varchar(50) unique,DOB varchar(10),ImgURL varchar(50) DEFAULT '/Images/contact_pic.jpg');",function (err,results,field) {
                                                    if(err)
                                                        console.log(err);
                                                    else
                                                    {
                                                        var p={
                                                            UUID:teacherpost.teacherUUID,
                                                            Username:teacherpost.teacherUsername,
                                                            Contact:PostContact,
                                                            Email:teacherpost.teacherEmail,
                                                            DOB:PostDOB
                                                        };
                                                        console.log("teacher p "+p);
                                                        console.log("p DOB "+p.DOB);
                                                        conn.query("Insert into "+Username+"Details set ?",p,function (err,results,field) {
                                                            if(err)
                                                                console.log(err);
                                                            else{
                                                                console.log("data inserted in teacherDetails");
                                                                res.send(JSON.stringify({"status": "done"}));
                                                            }
                                                        });
                                                        // res.send(JSON.stringify({"status": "done"}));
                                                    }
                                                });
                                        }
                                    });


                            }
                            else {
                                // send something to inform username or email already exist
                                console.log("results length isnt zero "+results[0]);
                                res.send(JSON.stringify({"status": "not done"}));
                            }

                        });
                    }
                    else if (selectedstate==="Student")
                    {conn.query("Select studentUsername from StudentUUID where studentUsername=? or studentEmail=? ", [Username, Email], function (error, results, fields) {

                        if (error)
                            console.log(error);
                        else{
                            if(results.length===0) {
                                conn.query("Insert into StudentUUID set ?", studentpost, function (err, results, field) {
                                    if (err)
                                        console.log(err);
                                    else {
                                        conn.query("create table "+Username+"Details(UUID varchar(20) unique,Username varchar(50) unique,Contact varchar(20),Email varchar(50) unique,DOB varchar(10),ImgURL varchar(50) DEFAULT '/Images/contact_pic.jpg');",function (err,results,field) {
                                            if(err)
                                                console.log(err);
                                            else
                                            {

                                                var p={
                                                    UUID:studentpost.studentUUID,
                                                    Username:studentpost.studentUsername,
                                                    Contact:PostContact,
                                                    Email:studentpost.studentEmail,
                                                    DOB:PostDOB
                                                };
                                                console.log("p DOB "+p.DOB);
                                                console.log("teacher p "+p);
                                                conn.query("Insert into "+Username+"Details set ?",p,function (err,results,field) {
                                                   if(err)
                                                       console.log(err);
                                                    else{
                                                       res.send(JSON.stringify({"status": "done"}));
                                                   }
                                                });


                                            }
                                        });
                                    }
                                });
                            }
                            else {
                                res.send(JSON.stringify({"status": "not done"}));
                            }

                    }
                    });

                    }   

                }

            });
        }
        else
        {
            console.log("Username and email are NULL");
            res.send(JSON.stringify({'status':'No'}));
        }
        
    }
    
})








module.exports=Router;