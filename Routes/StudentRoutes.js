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
Router.get('/addTeacher',urlencodeParser,function (req,res) {
    if(req.session&&req.session.userid&&req.session.type==="Student") {
        res.render('StudentAddTeacher');
    }
    else{
        req.session=null;
        res.render('my');
    }
});
Router.post('/addTeacherData',urlencodeParser,function (req,res){
    if(req.session&&req.session.userid&&req.session.type==="Student") {
        var teacherid=req.body.Teacherid.trim();
        // var batch=req.body.BatchName.trim();
        if(teacherid){
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
                con.query("CREATE TABLE IF NOT EXISTS "+req.session.userid+"TeacherList (Tusername varchar(50),BatchName varchar(50),PRIMARY KEY(Tusername,BatchName));",function (err,results,fields) {
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
                        else{
                            res.send(JSON.stringify({"status": "exists"}));
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
Router.get('/viewAttendance',urlencodeParser,function(req,res){
    if(req.session&&req.session.type==="Student"){
        res.render('StudentViewAttendance');
    }
    else{
        req.session=null;
        res.render('my');
    }
});
Router.get('/getTeachers',urlencodeParser,function(req,res){
    if(req.session&&req.session.type==="Student"){
        var teacher=[];
        pool.getConnection(function (err,con) {
           con.query("SELECT DISTINCT(Tusername) FROM "+req.session.userid+"TeacherList;",function (err,results,fields) {
               if(err)
                   console.log(err);
               if(!results&&results.length<0)
               {
                   res.send(JSON.stringify({"status":"notdone"}));
               }
               else{
                   var i=0;
                   for(i=0;i<results.length;i++)
                    teacher.push(results[i].Tusername);
                   if(i===results.length)
                   res.send(JSON.stringify({"status":"done","teacher":teacher}));
               }
           });
        });
    }
    else{
        req.session=null;
        res.render('my');
    }
});
Router.post('/getBatch',urlencodeParser,function(req,res){
    if(req.session&&req.session.type==="Student"&&req.body){
        var Tusername=req.body.Teacher.trim();
        var batch=[];
        pool.getConnection(function (err,con) {
            con.query("SELECT BatchName FROM "+req.session.userid+"TeacherList where Tusername=?;",Tusername,function (err,results,fields) {
                if(err)
                    console.log(err);
                if(!results&&results.length<0)
                {
                    res.send(JSON.stringify({"status":"notdone"}));
                }
                else{
                    var i=0;
                    for(i=0;i<results.length;i++)
                        batch.push(results[i].BatchName);
                    if(i===results.length)
                        res.send(JSON.stringify({"status":"done","batch":batch}));
                }
            });
        });
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
        var id =req.body.ID.trim();
        if(id){
            pool.getConnection(function (err,con) {
                if(err)
                    console.log(err);
                con.query("Select * from "+TeacherName+BatchName+"attendance where StudentID=?",id,function (err,results,fields) {
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
                        console.log(Arr);
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
Router.get('/viewMarksheet',urlencodeParser,function (req,res) {
   if(req.session&&req.session.userid&&req.session.type=="Student"){
       res.render('StudentViewMarksheet');
   }
    else{req.session=null;
       res.render('my');}
});
Router.post('/getMarksheet',urlencodeParser,function (req,res) {
    console.log("Request to getmarksheet");
    if(req.session&&req.session.userid&&req.session.type==="Student") {
        pool.getConnection(function (err, con) {
            console.log(err);

            con.query("show columns from " + req.body.BatchName.trim() + "Mark where Field LIKE '" + req.body.TeacherName.trim() + "%';", function (err, results, fields) {
                if (err)
                    console.log(err);
                var marklist = [];
                if (results.length <= 0) {
                    res.send(JSON.stringify({"status": "notdone"}));
                }
                else {
                    var i;
                    for (i = 0; i < results.length; i++) {
                        var r=results[i].Field;
                        var u=req.session.userid.trim();
                        var s=r.replace(u, " ");
                        console.log(s);
                        marklist.push(s);
                    }
                    res.send(JSON.stringify({"status": "done", "marklist": marklist}));
                }
            });

        });
    }});
        Router.post('/viewMarksheetData', urlencodeParser, function (req, res) {
            if (req.session && req.session.userid) {
                if (req.body) {
                    var TeacherName = req.body.TeacherName.trim();
                    var BatchName = req.body.BatchName.trim();
                    var StudentID = req.body.StudentID.trim();
                    var MarksheetTitle = req.body.Marksheettitle.trim();
                    if (TeacherName && BatchName && MarksheetTitle) {
                        pool.getConnection(function (err, con) {
                            console.log("markstitle "+MarksheetTitle);
                            var q="SELECT " + TeacherName + MarksheetTitle + " from " + BatchName + "Mark where StudentID='" + StudentID + "';";
                            console.log(q);
                            con.query(q, function (err, results, fields) {
                                if (err)
                                    console.log(err);
                                if (results <= 0)
                                    res.send(JSON.stringify({"status": "notdone"}));
                                res.send(JSON.stringify({
                                    "status": "done",
                                    "marks": results[0][TeacherName + MarksheetTitle]
                                }));
                            });
                        });
                    }
                }
            }
            else {
                req.session = null;
                res.render('my');
            }
        });


        module.exports = Router;

    