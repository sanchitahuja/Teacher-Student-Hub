/**
 * Created by pramo on 29-04-2017.
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

Router.post('/addTeacher',urlencodeParser,function (req,res){
    if(req.session&&req.session.userid&&req.session.type==="Student") {
        var teacherid=req.body.Teacherid.trim();
        var batch=req.body.BatchName.trim();
        if(batch&&teacherid){
            var teacherUsername="";
            pool.getConnection(function (err,con) {
                con.query("Select teacherUsername from teacheruuid where teacherUUID=?",teacherid,function (err,results,fields) {
                    if(err)
                        console.log(err);
                    if(results.length<=0){
                        res.send({"status":"notdone"});
                    }
                    else{
                        teacherUsername=results[0].teacherUsername.trim();
                        con.query("Select BatchName from "+teacherUsername+"BatchList;",function (err,results,fields) {
                           if(err)
                               console.log(err);
                            if(results.length<=0)
                                res.send(JSON.stringify({"status":"done","Arr":[]}));
                            else{
                                var Arr=[];
                                var i=0;
                                for(i=0;i<results.length;i++){
                                    Arr.push({"BatchName":results[i].BatchName})
                                }
                                res.send(JSON.stringify({"status":"done","Arr":Arr,"teacherUsername":teacherUsername}));
                            }
                        });
                    }


                });
            });
        }
    }
    else{
        req.session=null;
        res.render('my');
    }
});
Router.post('/addBatch',urlencodeParser,function (req,res) {
    if(req.session&&req.session.userid&&req.body){
        var BatchName=req.body.BatchName.trim();
        var teacherUsername=req.body.teacherUsername.trim();
        if(BatchName&&teacherUsername){
            pool.getConnection(function (err,con) {
                var insertdata={
                    "Tusername":teacherUsername,
                    "BatchName":BatchName
                };
                if(err)
                    console.log(err);
                con.query("CREATE TABLE "+req.session.userid+"TeacherList (Tusername varchar(50),BatchName varchar(50),PRIMARY KEY(Tusername,BatchName));",function (err,results,fields) {
                   if(err)
                       console.log(err);
                    con.query("SELECT * from "+req.session.userid+"TeacherList where BatchName=? AND Tusername=?",[BatchName,teacherUsername],function (err,results,fields) {
                        if(err)
                            console.log(err);
                        if(results.length<=0) {
                            con.query("INSERT INTO " + req.session.userid + "TeacherList set ?", insertdata, function (err, results, fields) {
                                if (err)
                                    console.log(err);
                                res.send(JSON.stringify({"status": "done"}));
                            });
                        }
                    });

                });

            });
        }
    }
    else{
        req.session=null;
        res.render('my');
    }
});

Router.post('/viewAttendanceData',urlencodeParser,function (req,res) {
    if(req.session&&req.session.userid&&req.body){

        var TeacherName =req.body.TeacherName.trim();
        var BatchName =req.body.BatchName.trim();
        var id =req.body.ID;
        if(id&&name){
            pool.getConnection(function (err,con) {
                if(err)
                    console.log(err);
                con.query("Select * from "+TeacherName+BatchName+"attendance where StudentID='?'",id,function (err,results,fields) {
                   if(err)
                       console.log(err);
                    if(results.length<=0)
                    {
                        res.send(JSON.stringify({"status":"notdone"}));
                    }
                    else{
                        var Arr=[];
                        var i=0;
                        var StudentID=fields[0].name;
                        var total=fields.length-1;
                        var present=0;
                        for(i=1;i<fields.length;i++){
                            if(results[0][fields[i].name]==='1')
                                present++;
                            Arr.push({"Date":fields[i].name,"P":results[0][fields[i].name]});
                        }
                        res.send(JSON.stringify({"status":"done","Arr":Arr,"total":total,"present":present}));
                    }
                });
            });
        }

    }
    else{
        req.session=null;
        res.render('my');
    }
});
Router.post('/viewMarksheetData',urlencodeParser,function (req,res) {
    if(req.session&&req.session.userid){
           if(req.body){
               var TeacherName =req.body.TeacherName.trim();
               var BatchName =req.body.BatchName.trim();
               var MarksheetTitle=req.body.Marksheettitle.trim();
               if(TeacherName&&BatchName&&MarksheetTitle){
                   
               }
           }
    }
    else{
        req.session=null;
        res.render('my');
    }
});










module.exports=Router;