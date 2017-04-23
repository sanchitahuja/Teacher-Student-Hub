/**
 * Created by pramo on 09-04-2017.
 */
var app = angular.module('AttendanceApp', []);

var MainController=function ($scope,$http,$window,$compile) {
    $scope.sendData=false;
    $scope.showList=false;
    var httprequestgetdata=null;
    var httprequestSenddata=null;
    var sendDataArr=[];

     $scope.arr=[];
    $scope.getList=function () {
        if ($scope.selectedbatch && $scope.date) {
            var httprequestgetdata=$http({
                method: "post",
                url: "/Attendance/getAttendancedata",
                data: {
                    BatchName:$scope.selectedbatch,
                    date:$scope.date
                }
            });
            httprequestgetdata.then(function (successresponse) {

                if(successresponse.data!==null){
                    $scope.arr=successresponse.data;
                    alert($scope.arr[0].StudentName);
                }
                else{
                    alert("Date already Marked");
                }
            }, function (errorresponse) {
                $window.alert("Server Error");
                $window.alert(errorresponse);
                });

        }
        else {
                alert("Batch and Date are required");
        }
        if($scope.arr.length>0){
            var table=document.getElementById('AttendanceTable');
            for(var i=0;i<$scope.arr.length;i++)
            {
                var row = table.insertRow(i+1);
                var cell1 = row.insertCell(0);
                var cell2 = row.insertCell(1);
                var cell3 = row.insertCell(2);
                cell1.innerHTML=""+$scope.arr[i].StudentID;
                cell2.innerHTML=""+$scope.arr[i].StudentName;
                var query='<button type="button" ng-click='+'"sendme('+'\''+$scope.arr[i].StudentID+'\''+')"'+'>Mark</button>';
                cell3.innerHTML=(query);
                // cell3.innerHTML='<input type="button" ng-click="sendme(\'' + $scope.arr[i].StudentID; + '\')" />';

            }
            $scope.showList=true;
            $scope.sendData=true;

        }
    }
    $scope.sendme=function (StudentID) {
        alert(StudentID);
        if(sendDataArr.indexOf(String(StudentID))===-1){

            sendDataArr.push(StudentID);
            document.getElementById(StudentID).style.backgroundColor = "#66ff33";
        }
        else{
            sendDataArr.splice(sendDataArr.indexOf(StudentID),1);
            document.getElementById(StudentID).style.backgroundColor = "#ff3333";
        }



    };
    $scope.sendlist=function () {
        var httprequestSenddata=$http({
            method: "post",
            url: "/Attendance/mark",
            data: {
                BatchName:$scope.selectedbatch,
                date:$scope.date,
                Arr:sendDataArr
            }
        });

    };
};



app.controller("MainController",MainController);