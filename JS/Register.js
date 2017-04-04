
var app = angular.module('RegisterApp', []);
var MainController = function ($scope,$http,$window) {
    $scope.showmeError=false;
    $scope.showme=false;
    $scope.Email = {
        text: 'me@example.com'
    };
    $scope.sendme=function () {

        alert($scope.Email);
        alert($scope.myForm.Email.$valid);
        alert($scope.Username);
        alert($scope.Email);
        alert($scope.Password);
        alert($scope.selectedstate);

        if($scope.myForm.Email.$valid===true) {
         alert("hi");
            var httpreq = $http({
                method: "post",
                url: "/register/req",
                data: {
                    username: $scope.Username,
                    email: $scope.Email,
                    contact: $scope.Contact,
                    password: $scope.Password,
                    selectedstate: $scope.selectedstate,
                    date:$scope.date
                }

            });



        }

        httpreq.then(function (successresponse) {
                alert(successresponse.data.status);
            if(successresponse.data.status==="done")
            {
                $scope.Username="";
                $scope.Email="";
                $scope.Contact="";
                $scope.Password="";
                $scope.showme=true;
                $scope.showmeError=false;
                $scope.date=""
            }
            else
            {
                $scope.Username="";
                $scope.Email="";
                $scope.Contact="";
                $scope.Password="";
                $scope.showmeError=true;
                $scope.date=""
               $scope.showme=false;
            }

        },
        function (errorresponse) {
            $window.alert("Server Error");
            $window.alert(errorresponse);
        });

    }
}

app.controller("MainController",MainController);