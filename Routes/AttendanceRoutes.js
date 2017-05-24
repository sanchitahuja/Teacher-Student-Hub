/**
 * Created by pramo on 05-04-2017.
 */
var express=require('express');
var mysql=require('mysql');
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
var studentdatadetails=[];

var batchList=[];
var addBatchList=function (BatchName,BatchID) {
    this.BatchName=BatchName;
    this.BatchID=BatchID;
};

Router.get('/',function (req,res) {
    if(req.session&&req.session.userid&&req.session.type==="Teacher")
    {
            console.log("Request to /Attendance");
        pool.getConnection(function (err,conn) {
            if(err)
                console.log(err);
            conn.query("Select BatchID,BatchName from "+req.session.userid+"BatchList ;",function (err,results,fields) {
                if(err){
                    console.log(err);
                }

                console.log(results);
                batchList=[];
                for(var i=0;i<results.length;i++) {
                    console.log("in reults");
                    batchList.push({BatchName:results[i].BatchName,BatchID:results[i].BatchID});
                }
                console.log(batchList.length);
                console.log(batchList);
                res.render('MarkAttendance',{BatchList:batchList});
            });

        });

    }
    else{
        res.render('my');
    }

});



Router.post('/getAttendancedata',urlencodeParser,function (req,res) {
    if(req.session&&req.session.userid) {
        console.log("Request to /Attendance/getAttendancedata");
        if (!req.body) {
            res.send(JSON.stringify({'status': 'nothing'}));
            console.log("Body is empty");
        }
        else {

            pool.getConnection(function (err,conn) {
                if(err)
                    console.log(err);
                var query="Select StudentID,StudentName from "+req.body.BatchName.trim()+"batch ";
                console.log("query "+query);
               conn.query(query,function (err,results,fields) {
                   if(err)
                       console.log(err);
                   console.log(results);
                 for(var i=0;i<results.length;i++) {
                     studentdatadetails.push({StudentID:results[i].StudentID,StudentName:results[i].StudentName});
                 }
                   console.log(studentdatadetails);
                   res.send(JSON.stringify(studentdatadetails));
                   // console.log(JSON.stringify({"data":studentdatadetails}));
               });

            });


        }
    }
    else{
        res.redirect('my');
    }
});

Router.post('/mark',urlencodeParser,function (req,res) {
    if(req.session)
    {
        if(!req.body){
            console.log("Body is null");
            res.send(JSON.stringify({"status":"not done"}));
        }
        else{
            var arr=req.body.Arr;
            console.log(arr);
            pool.getConnection(function (err,con) {
                // var q="CREATE OR REPLACE VIEW source_data AS SELECT StudentID FROM "+req.body.BatchName.trim()+"batch ;"
                // +"Create TABLE IF NOT EXITS "+req.session.userid.trim()+req.body.BatchName.trim()+"Attendance LIKE source_data;"
                // +"Insert into "+req.session.userid.trim()+req.body.BatchName.trim()+"Attendance Select StudentID from source_data;";
                var q=" CREATE TABLE IF NOT EXISTS "+req.session.userid.trim()+req.body.BatchName.trim()+"Attendance(StudentID varchar(10) PRIMARY KEY);";
                con.query(q,function (err,results,fields) {
                        if(err){
                            console.log(err);
                            // res.send(JSON.stringify({'status':'server err'}));
                        }
                    con.query("SELECT * FROM "+req.session.userid.trim()+req.body.BatchName.trim()+"Attendance;",function (err,results,fileds) {
                        if(err)
                            console.log(err);
                        if(results.length===0){
                            con.query("Insert into "+req.session.userid.trim()+req.body.BatchName.trim()+"Attendance (StudentID) Select StudentID from "+req.body.BatchName.trim()+"batch;"
                                ,function (err,results,fields) {
                                    console.log(err);
                                }
                            );}
                    });
                    con.query("show columns from "+req.session.userid+req.body.BatchName.trim()+"Attendance where Field=?",req.body.Date,
                        function (err,results,fields) {
                            if(err)
                            {
                                // res.send(JSON.stringify({'status':'server err'}));
                                console.log(err);
                            }
                            else {
                                if (results!==null&&results.length > 0) {
                                    console.log("MARKED");
                                    res.send(JSON.stringify({'status': 'marked'}));
                                    console.log(err);
                                }
                                else {

                                    console.log("NOT MARKED");
                                    var date = req.body.Date;
                                    console.log("date "+date);
                                    con.query("ALTER TABLE " + req.session.userid.trim() + req.body.BatchName.trim() + "Attendance ADD `"+date.trim()+"` char(1) DEFAULT '0'; ",
                                        function (err, results, fields) {
                                            console.log(err);
                                            console.log("Inside Alter Table");
                                            var id =(req.body.Date);
                                            // var setdata = {id: '1'};
                                            // console.log("setdata "+setdata);
                                            for (var i = 0; i < req.body.Arr.length; i++) {
                                                console.log("In loop od insertion arr "+req.body.Arr[i]);
                                                con.query("Update " + req.session.userid.trim() + req.body.BatchName.trim() +"Attendance set `"+id+"`='1' where StudentID=?", req.body.Arr[i].StudentID,
                                                    function (err,results,fields) {
                                                        // res.send(JSON.stringify({'status':'server err'}));
                                                        console.log(err);
                                                    });

                                            }
                                            console.log("Status sent");
                                            res.send(JSON.stringify({'status':'done'}));


                                        });

                                }
                            }
                        });


                    }
                );



            });

        }
    }
    else{
        res.render('my');
    }

});
// Router.post('/TeacherviewAttendance',urlencodeParser,function (req,res) {
//    if(req.session){
//        if(req.body){
//            var batchname=req.body.batchName;
//            pool.getConnection(function (err,con) {
//                if(err){
//                    res.send(JSON.stringify({"status":"Error"}));
//                    console.log(err);
//                }
//                else{
//                    var obj=[];
//                    con.query("Select * from "+req.session.userid+batchname+"Attendance;",function (err,results,fields) {
//                        if(err)
//                            console.log(err);
//                       if(results.length>0)
//                       {
//                           var attendanceArr=[];
//
//                           for(var j=0;j<results.length;j++){
//                               var item={};
//                               for(var i=0;i<fields.length;i++){
//                                   item[fields[i].name]=results[j][fields[i].name];
//                               }
//                               attendanceArr.push(item);
//                           }
//                           res.send(JSON.stringify(attendanceArr))
//                       }
//                        else{
//                           res.send(JSON.stringify({"status":"!exist"}));
//                       }
//                    });
//                }
//                   
//               
//               
//            })
//        }
//        else{
//
//            console.log('Body is null');
//        }
//    } 
//     else{
//        console.log('session is dead');
//        res.render('my');
//    }
// });
//
module.exports=Router;