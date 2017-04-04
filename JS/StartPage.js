
var app = angular.module('StartApp', []);

var MainController = function ($scope, $http, $window) {
   
    // MainController.$inject = ["$scope"];
    angular.module('StartApp', []).controller
        ('MainController', MainController);


    $scope.postme = function () {
       var httpreq= $http({
            method: "post",
            url: "/TeacherLogin",
            headers : { 'Content-Type': 'application/json' } ,
            data: {
                UserName: $scope.UserName,
                Password: $scope.Password
            }
        });
        httpreq.then(function(successresponse)
        {
            console.log(successresponse);
            $window.location.href=successresponse.data.URL;
        // var resdata= angular.fromJson(successresponse);
        // $window.alert(resdata);
        // var resdata=JSON.parse(successresponse.data);
      //  $scope.resdata=successresponse.data.d;
        // $window.alert($scope.resdata.Exist);  
        //  console.log(resdata.URL);  
        
        },
            function(errresponse)
        {
        $window.alert("Wrong UserName or Password..!! Retry!!");

        });

    }

    // $scope.postme=function () {

    // $http.post('/TeacherLogin',"helllloooooooooo").then(function(successresponse)
    // {
    // $window.location.href=successresponse;
    // },
    // function(errresponse)
    // {
    // $window.alert(errresponse);
    // }


    // );

    // }
    //  var datad = {
    //     UserName: $scope.UserName,
    //     Password: $scope.Password,
    // };

}