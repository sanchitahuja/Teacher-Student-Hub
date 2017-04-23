// /**
//  * Created by pramo on 07-04-2017.
//  */
// var mysql=require('mysql');
// var pool = mysql.createPool({
//     host: "localhost",
//     user: "root",
//     password: "root",
//     database: "std_database"
// });
// //
// // pool.query('show columns from nishthadetails where Field="balh"',function (err,results,fields) {
// //    // for(i=0;i<results.length;i++)
// //    // {
// //    //     console.log(results.Field[]);
// //    // }
// //
// // });
// var obj=[];
// pool.query("select * from nishthadetails",function (err,results,fields) {
//     var obj=[];
//     var item={};
//         for(var j=0;j<results.length;j++){
//             for(var i=0;i<fields.length;i++){
//                item[fields[i].name]=results[j][fields[i].name];
//             }
//         }
//
//     console.log(item);
//
//
// });
var sendDataArr=[];
sendDataobj=function (StudentID) {
    this.StudentID=StudentID;
};
sendme=function (StudentID1) {
    sendDataArr.push(StudentID1);

};
sendme("15");
sendme("16");
sendme("17");
console.log(sendDataArr);
console.log("Index of 15 "+sendDataArr.indexOf('15'));
sendDataArr.splice(0,1);

console.log(sendDataArr);
