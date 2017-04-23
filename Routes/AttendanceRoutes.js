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
    if(req.session!==null)
    {

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
    if(req.session) {
        if (!req.body) {
            res.send(JSON.stringify({'status': 'nothing'}));
            console.log("Body is empty");
        }
        else {
            pool.getConnection(function (err,conn) {
                if(err)
                    console.log(err);
               conn.query("Select StudentID,StudentName from firstbatchbatch ",function (err,results,fields) {
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
    if(req.session!==null)
    {
        if(!req.body){
            console.log("Body is null");
            res.send(JSON.stringify({"status":"not done"}));
        }
        else{
            var arr=req.body.Arr;
            console.log(arr);
            pool.getConnection(function (err,con) {
                con.query("Create table "+ req.session.userid + req.data.BatchName + "Attendance  if not exists as Select StudentID from "+req.BatchName+";",
                    function (err,results,fields) {
                        if(err){
                            console.log(err);
                            res.send(JSON.stringify({'status':'server err'}));
                        }

                    }
                );
                    con.query("show columns from "+req.session.userid+req.data.BatchName+"Attendance where Field=?",req.data.Date,
                        function (err,results,fields) {
                            if(err)
                            {
                                res.send(JSON.stringify({'status':'server err'}));
                                console.log(err);
                            }
                            else {
                                if (results.length > 0) {
                                    res.send(JSON.stringify({'status': 'marked'}));
                                    console.log(err);
                                }
                                else {
                                    var date = String.valueOf(req.data.date);
                                    con.query("ALTER TABLE " + req.session.userid + req.data.BatchName + "Attendance ADD ? char(1) DEFAULT '0'", date,
                                        function (err, results, fields) {
                                            if(err)
                                            {
                                                res.send(JSON.stringify({'status':'server err'}));
                                                console.log(err);
                                            }
                                            else {


                                                var id = String.valueOf(req.body.date);
                                                var setdata = {date: '1'};
                                                for (var i = 0; i < req.data.Arr.length; i++) {
                                                    con.query("Insert into " + req.session.userid + req.data.BatchName + "Attendance set ? where StudentID=?", [setdata,req.body.Arr[i]],
                                                        function (err,results,fields) {
                                                            res.send(JSON.stringify({'status':'server err'}));
                                                            console.log(err);
                                                        });

                                                }
                                                res.send(JSON.stringify({'status':'done'}));

                                            }
                                        });

                                }
                            }
                        });


            });

        }
    }
    else{
        res.render('my');
    }

});
Router.post('/TeacherviewAttendance',urlencodeParser,function (req,res) {
   if(req.session){
       if(req.body){
           var batchname=req.body.batchName;
           pool.getConnection(function (err,con) {
               if(err){
                   res.send(JSON.stringify({"status":"Error"}));
                   console.log(err);
               }
               else{
                   var obj=[];
                   con.query("Select * from "+req.session.userid+batchname+"Attendance;",function (err,results,fields) {
                       if(err)
                           console.log(err);
                      if(results.length>0)
                      {
                          var attendanceArr=[];

                          for(var j=0;j<results.length;j++){
                              var item={};
                              for(var i=0;i<fields.length;i++){
                                  item[fields[i].name]=results[j][fields[i].name];
                              }
                              attendanceArr.push(item);
                          }
                          res.send(JSON.stringify(attendanceArr))
                      }
                       else{
                          res.send(JSON.stringify({"status":"!exist"}));
                      }
                   });
               }
                   
               
               
           })
       }
       else{

           console.log('Body is null');
       }
   } 
    else{
       console.log('session is dead');
       res.render('my');
   }
});
Router.post('/Studentviewattendance/data',urlencodeParser,function (req,res) {
   if(req.session){
       if(req.body){
        var batch=req.data.BatchName;
        var Teacher=req.data.TeacherName;
        pool.getConnection(function (err,con) {
          con.query("Select teacherUsername from teacherUUID where teacherUUID=?;",req.body.data.UUID,function (err,results,fields) {
              if(err){
                  res.send(JSON.stringify({"status":"Error"}));
                  console.log(err);
              }
              else{
                  
              }
          });
        }); 
       }
       else{
           console.log("Body is null");
       }
   } 
    else{
       res.render('my');   
   }
});

module.exports=Router;