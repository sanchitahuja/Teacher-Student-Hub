/**
 * Created by pramo on 04-04-2017.
 */
var express=require('express');
var mysql=require('mysql');
var shortid = require('shortid');
var Router=express.Router();
var bodyparser = require('body-parser');
var urlencodeParser = bodyparser.urlencoded({ extended: false });
var pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "root",
    database: "std_database"
});
var cookiesession = require('cookie-session');
Router.use(cookiesession({
    cookieName: 'session',
    keys: ['hello']
}));
Router.get('/CreateBatch',function (req,res) {
    console.log("Got request for Create batch");
    if(req.session!==null)
   res.render('TeacherCreateBatch');
    else
        res.render('my');
});
Router.post('/addbatch',urlencodeParser,function (req,res) {
    console.log(req.session);
    if(req.session) {
        if (!req.body) {
            console.log("Body is empty");
            res.send(JSON.stringify({'status': 'not done'}));
        }
        else
        {
            pool.getConnection(function (err,conn) {
                if(err)
                {
                    console.log(err);
                    res.send(JSON.stringify({'status': 'not done'}));
                }
                else
                {
                    if(req.session.type==="Teacher")
                    {
                        conn.query('Select * from BatchList where BatchName=?',req.body.BatchName,function (err,results,fields) {
                         if(err){
                             res.send(JSON.stringify({'status': 'not done'}));
                             console.log(err);
                         }

                            if(results.length===0){
                                console.log("Batch Name Unique");
                                var details={
                                    BatchID:shortid.generate(),
                                    BatchName:req.body.BatchName
                                };
                                conn.beginTransaction(function (err) {
                                    if(err)
                                    {
                                        // res.send(JSON.stringify({'status': 'not done'}));
                                        console.log(err);
                                    }
                                    else {
                                        console.log("details "+details.BatchID +" "+details.BatchName);
                                        conn.query("CREATE TABLE IF NOT EXISTS "+req.session.userid+"BatchList (BatchID varchar(20) unique,BatchName varchar(50));"
                                            ,function (err,results,fields) {
                                            if(err){
                                                // res.send(JSON.stringify({'status': 'not done'}));

                                                console.log(err);
                                            }
                                        });
                                        conn.query('Insert INTO BatchList set ?',details,function (err,results,fields) {
                                            if(err){
                                                // res.send(JSON.stringify({'status': 'not done'}));

                                                console.log(err);
                                            }
                                        });
                                        conn.query("Create Table if not exists "+details.BatchName +"Batch (StudentID varchar(10),StudentName varchar(50))",function (err,results,fields) {
                                            if(err){
                                                // res.send(JSON.stringify({'status': 'not done'}));
                                                console.log(err);
                                            }
                                        });
                                        conn.query("Insert INTO "+req.session.userid+"BatchList set ?",details,function (err,results,fields) {
                                            if(err)
                                            {
                                                // res.send(JSON.stringify({"status":"not done"}));
                                                console.log(err);
                                            }
                                        });
                                    }
                                });
                                conn.commit(function (err) {
                                    if(err){
                                        // res.send(JSON.stringify({'status': 'not done'}));
                                        console.log(err);
                                    }
                                    else{
                                        res.send(JSON.stringify({'status': "done"}));
                                    }

                                });
                                
                            }
                            else{
                                console.log("Batch Name already Exists ");
                                res.send(JSON.stringify({'status': "not done"}));
                            }


                        });
                    }
                }

            });
        }
    }
    else{
        console.log("Session is Dead");
        res.render('my');
    }
});
Router.post('/addbatch_data',urlencodeParser,function (req,res) {
    if(!req.body){
        console.log("Body is empty add_Batch_data");
        res.send(JSON.stringify({"status":"not done"}));
    }
    else{
        if(req.body!==null)
        {
            console.log(req.body.Arr);
            if(req.body.Arr.length>0)
            {
                pool.getConnection(function (err,conn) {
                for(i=0;i<req.body.Arr.length;i++)
                {
                   
                       if(err)
                       {
                           // res.send(JSON.stringify({"status":"not done"}));
                           console.log(err);

                       }
                        else{
                           conn.query("Insert into "+req.body.BatchName+"Batch set ?",req.body.Arr[i],function (err,results,fields) {
                               if(err)
                               {
                                   // res.send(JSON.stringify({"status":"not done"}));
                                   console.log(err);
                               }
                           });


                       }
                   
                }
                    console.log("Status sent");
                    res.send(JSON.stringify({"status":"done"}));
                });           
            }
        }
        else{
            console.log("Req data is NULL");
            res.send(JSON.stringify({"status":"not done"}));
        }
    }

});
Router.post('/addBatch/URL',urlencodeParser,function (req,res) {
   if(req.session===null)
   {
       res.render('my');
   }
    else {
       if (req.body !== null) {
           pool.getConnection(function (err, con) {


               if (err) {
                   // res.send(JSON.stringify({"URL": "wrong"}))
                   console.log(err);
               }
               else {
                   con.query("SELECT EXISTS(SELECT 1 FROM BatchList WHERE BatchID=?);", req.body.URL, function (err, results, fields) {
                       if (err) {
                           // res.send(JSON.stringify({"URL": "wrong"}));
                           console.log(err);
                       }
                       else{

                       }
                   });
               }

           });

       }
       else{
           console.log("Body is null");
           res.send(JSON.stringify({"URL": "wrong"}));
       }
   }
});
module.exports=Router;