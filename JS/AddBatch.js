/**
 * Created by pramo on 03-04-2017.
 */
var app = angular.module('BatchApp', []);

var MainController=function ($scope,$http,$window) {
    $scope.batchcreated=false;
    $scope.batchDone=false;
    var studentArr=[];
    var studentobj=function(name,rollno)
    {
        this.StudentID=rollno;
        this.StudentName=name;
        

    }


         $scope.createbatch=function () {
             if($scope.myForm1.$valid===true)
             {

                 var batchname=$scope.BatchName.trim();
            var httpreq = $http({
                method: "post",
                url: "/Login/Batch/addbatch",
                data: {
                    BatchName: $scope.BatchName
                }
            });
            httpreq.then(function (successresponse) {
                if(successresponse.data.status==="done"){
                    $scope.batchcreated=true;
                    document.getElementsByName("BatchName").readOnly=true;
                }
                else{
                    $scope.batchcreated=false;
                    alert("Batch Already exists");
                }

            }, function (errorresponse) {
                $scope.batchcreated=false;
                alert("TRY AGAIN..!!! Server error ");
            });
        } else
             {
                 alert("BatchName not Valid");
             }
    }

    $scope.addstudent=function () {
        if($scope.batchcreated===true)
        {
            studentArr.push(new studentobj($scope.StudentName,$scope.Rollno));
            $scope.StudentName="";
            $scope.Rollno="";
        }
    }
    $scope.addBatchdata=function(){
      if(studentArr.length!==0){
          var httpreq2=$http({
            method:"post",
            url:"/Login/Batch/addbatch_data",
            data:{
                BatchName:$scope.BatchName,
                Arr:studentArr
            }
          });
          httpreq2.then(function (successresponse) {
              alert(successresponse.data.status);
            if(successresponse.data.status==="done")
            {
                $scope.batchDone=true;
                $scope.batchcreated=false;
            }

          },function (errorresponse) {
              alert("Server Error!!");
          });


      }

    }
}
app.controller("MainController",MainController);