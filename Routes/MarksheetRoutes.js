/**
 * Created by pramo on 23-04-2017.
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
var batchList=[];
var addBatchList=function (BatchName,BatchID) {
    this.BatchName=BatchName;
    this.BatchID=BatchID;
};

Router.get('/',function (req,res) {
    if(req.session&&req.session.userid)
    {
        console.log(req.session);
        console.log("Request to /AddMarksheet");
        pool.getConnection(function (err,con) {
            if(err)
                console.log(err);
            con.query("Select BatchID,BatchName from "+req.session.userid+"BatchList ;",function (err,results,fields) {
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
                res.render('AddMarksheet',{BatchList:batchList});
            });

        });

    }
    else{
        res.render('my');
    }

});
Router.post('/addSheet',urlencodeParser,function (req,res) {
   if(req.session)
   {
       pool.getConnection(function (err,con) {
          if(err)
           console.log(err);
           con.query("SELECT 1 FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE='BASE TABLE'AND TABLE_NAME ='"+req.body.BatchName.trim()+"Mark';"
           ,function (err,results,fields){
                   if(err)
                       console.log(err);
                   // console.log("Table NOt found");
                   if(results.length>0){
                       console.log("Table EXIST ALREADY");
                   }else{
                       con.query("CREATE TABLE IF NOT EXISTS "+req.body.BatchName.trim()+"Mark(StudentID varchar(10));",function (err,results,fields) {
                          if(err){
                              console.log("Error Table creation");
                              console.log(err);
                          }
                           else
                           console.log("Table CREATED");
                       con.query("INSERT INTO "+req.body.BatchName.trim()+"Mark Select StudentID from "+req.body.BatchName.trim()+"batch;",function (err,results,fields) {
                          if(err){
                              console.log("Error in inserting student details");
                              console.log(err);
                          }
                           else
                           console.log("Students added");
                       });
                       });
                   }

           con.query("show columns from "+req.body.BatchName.trim()+"Mark where Field=?",req.session.userid+req.body.MarkTitle.trim(),function (err,results,fields) {
              if(err)
                  console.log(err);
               else {
                  console.log("In alter table block");
                  if (results.length <= 0) {
                      
                      var q="ALTER TABLE "+ req.body.BatchName.trim() + "Mark ADD `"+  req.session.userid + req.body.MarkTitle.trim()+"` INTEGER;";
                      console.log("Alter table query "+q);
                      con.query(q, function (err, results, fields) {
                          if (err)
                              console.log(err);

                          console.log("Table Columns Added");
                          var q="SELECT "+req.body.BatchName.trim() + "batch"+".StudentID,StudentName from "+req.body.BatchName.trim() + "Mark," + req.body.BatchName.trim() + "batch where " + req.body.BatchName.trim() + "Mark.StudentID=" +req.body.BatchName.trim() + "batch.StudentID";
                          console.log("query "+q);
                          var arr=[];
                          con.query(q, function (err, results, fields) {
                              if (err)
                                  console.log(err);
                              for (var i = 0; i < results.length; i++) {
                                  arr.push({"StudentID": results[i].StudentID, "StudentName": results[i].StudentName});
                              }
                              res.send(JSON.stringify({"data": arr,"status": "done" }));
                              console.log("Values of arr stored " + arr);
                          });
                          // console.log("arr Student id"+arr[0].StudentID);


                          console.log("Arr sent wwith status");
                      });
                  }
                  else {
                      res.send(JSON.stringify({"status": "exists"}));
                  }
              }
           });
       });
       });
   }
    else{
       res.render('my');
   }
});

Router.post('/addMarks',urlencodeParser,function (req,res) {
    //marks array with id
    // marks title
    //batchname
    if(req.session)
    {
        var arr=req.body.Arr;
        console.log(arr);
        if(arr&&arr.length>0)
        {
            pool.getConnection(function (err,con) {
                var i=0;
                if(err)
                    console.log(err);
            for(i=0;i<arr.length;i++)
            {
               con.query("UPDATE "+req.body.BatchName.trim()+"Mark set "+req.session.userid+req.body.MarkTitle+"=? where StudentID=?",[arr[i].Marks,arr[i].StudentID],function(err,results,fields) {
                if(err)
                    console.log(err);
               }
               );
            }
                if(i===arr.length)
                    res.send({"status":"done"});
            });

            
        }
    }
    else{
        res.render('my');
    }
});
Router.get('/manageMarksheet',urlencodeParser,function (req,res) {
    if(req.session&&req.session.userid&&req.session.type==="Teacher")
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
                res.render('ManageMarksheet',{BatchList:batchList});
            });

        });
    }
    else{
        req.session=null;
        res.render('my');
    }
});
Router.post('/manageMarksheet/getList',urlencodeParser,function (req,res) {
    if(req.session&&req.session.userid&&req.session.type==="Teacher") {
pool.getConnection(function (err,con) {
    console.log(err);

        con.query("show columns from "+req.body.BatchName.trim()+"Mark where Field LIKE '"+req.session.userid.trim()+"%';",function (err,results,fields) {
            if(err)
                console.log(err);
            var marklist=[];
            if(results.length<=0)
            {
                res.send(JSON.stringify({"status":"notdone"}));
            }
            else{
                var i;
                for(i=0;i<results.length;i++)
                {
                    marklist.push((results[i].Field).replace(req.session.userid.trim(),''));
                }
                res.send(JSON.stringify({"status":"done","marklist":marklist}));
            }
        });
    con.release();
});
    }
    else{
        req.session=null;
        res.render('my');
    }


});
Router.post('/manageMarksheet/getMarks',urlencodeParser,function (req,res) {
    if(req.session&&req.session.userid){
        var BatchName=req.body.BatchName.trim();
        var TeacherID=req.session.userid.trim();
        var MarkSheetTitle=req.body.MarkTitle.trim();
        if(BatchName&&MarkSheetTitle&&TeacherID){
            pool.getConnection(function (err,con) {
                var MarksArray=[];
                con.query("Select StudentID,"+TeacherID+MarkSheetTitle+" from "+BatchName+"Mark;",function (err,results,fields) {
                    if(err)
                        console.log(err);
                    var i;
                    var x=TeacherID+MarkSheetTitle;
                    for(i=0;i<results.length;i++)
                    {
                        MarksArray.push({"StudentID":results[i].StudentID,"Marks":results[i][x]});
                    }
                    console.log(MarksArray);
                    if(i===results.length)
                        res.send(JSON.stringify({"data":MarksArray,"status":"done"}));
                    else
                        res.send(JSON.stringify({"status":"notdone"}));
                });
            });
        }
    }
    else{
        req.session=null;
        res.render('my');
    }
});
Router.post('/manageMarksheet/updateMarksheet',urlencodeParser,function (req,res) {
    if(req.session&&req.session.userid){
        var arr=req.body.Arr;
        console.log(arr);
        if(arr&&arr.length>0)
        {
            pool.getConnection(function (err,con) {
                var i=0;
                if(err)
                    console.log(err);
                for(i=0;i<arr.length;i++)
                {
                    con.query("UPDATE "+req.body.BatchName.trim()+"Mark set "+req.session.userid+req.body.MarkTitle+"=? where StudentID=?",[arr[i].Marks,arr[i].StudentID],function(err,results,fields) {
                            if(err)
                                console.log(err);
                        }
                    );
                }
                if(i===arr.length)
                    res.send({"status":"done"});
            });


        }
    }
    else{
        req.session=null;
        res.render('my');
    }
});
module.exports=Router;