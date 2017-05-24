// // /**
// //  * Created by pramo on 07-04-2017.
// //  */
var mysql=require('mysql');
var pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "root",
    database: "std_database"
});
// // //
// // // pool.query('show columns from nishthadetails where Field="balh"',function (err,results,fields) {
// // //    // for(i=0;i<results.length;i++)
// // //    // {
// // //    //     console.log(results.Field[]);
// // //    // }
// // //
// // // });
// // var obj=[];
// // pool.query("select * from nishthadetails",function (err,results,fields) {
// //     var obj=[];
// //     var item={};
// //         for(var j=0;j<results.length;j++){
// //             for(var i=0;i<fields.length;i++){
// //                item[fields[i].name]=results[j][fields[i].name];
// //             }
// //         }
// //
// //     console.log(item);
// //
// //
// // });
// // var sendDataArr=[];
// // sendDataobj=function (StudentID) {
// //     this.StudentID=StudentID;
// // };
// // sendme=function (StudentID1) {
// //     sendDataArr.push(StudentID1);
// //
// // };
// // sendme("15");
// // sendme("16");
// // sendme("17");
// // console.log(sendDataArr);
// // console.log("Index of 15 "+sendDataArr.indexOf('15'));
// // sendDataArr.splice(0,1);
// //
// // console.log(sendDataArr);
// var mysql=require('mysql');
// var pool = mysql.createPool({
//     host: "localhost",
//     user: "root",
//     password: "root",
//     database: "std_database"
// });
// // pool.getConnection(function (err,conn) {
// //    conn.query("Create table if not exists hi(s char(1));",function (err,results,fields) {
// //        if(err)
// //            console.log(err);
// //        console.log(results.warningCount);
// //        console.log("results length "+results.length);
// //    }) ;
// // });
// // var q=
// // con.query("SELECT StudentID,StudentName from "+req.body.BatchName.trim() + "Mark," + req.body.BatchName.trim() + "batch where " + req.body.BatchName.trim() + "Mark.StudentID=" + req.session.userid + req.body.BatchName.trim() + "batch.StudentID", function (err, results, fields) {
// //     if (err)
// //         console.log(err);
// //     for (var i = 0; i < results.length; i++) {
// //         arr.push({"StudentID": arr[i].StudentID, "StudentName": arr[i].StudentName,});
// //     }
// //
// //     console.log("Values of arr stored " + arr);
// // });
// pool.getConnection(function (err,con) {
    // var TeacherID="nishtha";
    // var MarkSheetTitle="sem";
    // var BatchName="firstbatch";
    // con.query("Select StudentID,"+TeacherID+MarkSheetTitle+" from "+BatchName+"Mark;",function (err,results,fields) {
    //     console.log(err);
    //             for(var i=0;i<results.length;i++)
    //             {
    //                 console.log(results[i]);
    //
    //             }
    // });
//     pool.getConnection(function (err,con) {
//         var MarksArray = [];
//         var TeacherID = "nishtha";
//         var MarkSheetTitle = "sem";
//         var BatchName = "firstbatch";
//         var que="Select StudentID," + TeacherID + MarkSheetTitle + " from " + BatchName + "Mark;";
//         console.log("Query:"+que);
//         con.query(que, function (err, results, fields) {
//             if (err)
//                 console.log(err);
//             var i;
//             var x = TeacherID + MarkSheetTitle;
//             console.log("x "+x);
//             // console.log(fields[1].name);
//             for (i = 0; i < results.length; i++) {
//                     // console.log(results[i]);
//                      console.log(fields[i]);
//
//                 // MarksArray.push({"StudentID": results[i].StudentID, "Marks": results[i][x]});
//
//             }
//             for (var i = 0; i < results.length; i++) {
//                 console.log(MarksArray[i]);
//
//             }
//         });
//
//     });      // var q="show columns from firstbatch"+"Mark where Field LIKE "+"'nishtha"+"%';";
//     // console.log("Query:"+ q);
//     // con.query(q,function (err,results,fields) {
//     //
//     //         console.log(err);
//     //     var marklist=[];
//     //     if(results.length<=0)
//     //     {
//     //
//     //     }
//     //     else{
//     //         for(var i=0;i<results.length;i++)
//     //         {
//     //             console.log(results[i]);
//     //
//     //         }
//     //     }
//     // });
// // });

function twoDigits(d) {
    if(0 <= d && d < 10) return "0" + d.toString();
    if(-10 < d && d < 0) return "-0" + (-1*d).toString();
    return d.toString();
}

/**
 * …and then create the method to output the date string as desired.
 * Some people hate using prototypes this way, but if you are going
 * to apply this to more than one Date object, having it as a prototype
 * makes sense.
 **/
Date.prototype.toMysqlFormat = function() {
    return this.getUTCFullYear() + "-" + twoDigits(1 + this.getUTCMonth()) + "-" + twoDigits(this.getUTCDate()) + " " + twoDigits(this.getUTCHours()) + ":" + twoDigits(this.getUTCMinutes()) + ":" + twoDigits(this.getUTCSeconds());
};

pool.getConnection(function (err,con) {

var time=new Date().toMysqlFormat();
    console.log(time);


con.query("SELECT * FROM Posts ORDER BY Time DESC;",urlencodeParser,function (err,results,fields) {
    if(err)
        console.log(err);
    if(results.length<=0){

    }
    else{
        var i=0;
        for(i=0;i<results.length;i++){
            console.log(results[i]);
            var data={
                "PostID":results[i].PostID,
                "PostText":results[i].PostText,
                "Time":results[i].Time,
                "PosterID":results[i].PosterID
            }
            arr.push(data);

        }
       
    }
});
});

