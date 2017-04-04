/**
 * Created by pramo on 03-04-2017.
 */
var app = angular.module('BatchApp', []);
$scope.batchcreated=false;
$scope.batchDone=false;
var MainController=function ($scope,$http,$window) {
    var studentArr=[];
    var studentobj=function(name,rollno)
    {
        this.Name=name;
        this.Rollno=rollno;

    }
    if($scope.BatchName.$valid===true)
    {

        var batchname=$scope.BatchName;
         $scope.createbatch=function () {
            var httpreq = $http({
                method: "post",
                url: "/Batch/addbatch",
                data: {
                    BatchName: $scope.BatchName
                }
            });
            httpreq.then(function (successresponse) {
                if(successresponse.data.status==="done"){
                    $scope.batchcreated=true;
                }
                else
                    $scope.batchcreated=false;

            }, function (errorresponse) {
                $scope.batchcreated=false;
                alert("TRY AGAIN..!!! Server error ");
            });
        }
    }
    else
    {
        $scope.createbatch=function () {
            alert("BatchName not Valid");
        };
    }
    $scope.addstudent=function () {
        if(batchcreated===true)
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
            url:"/Batch/addbatch_data",
            data:studentArr
          });
          httpreq2.then(function (successresponse) {
            if(successresponse.status==="done")
            {
                $scope.batchDone=false;
            }

          },function (errorresponse) {
              alert("Server Error!!");
          });


      }

    }








}