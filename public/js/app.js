angular.module('app', ['ngRoute'])
.controller('EventCtrl', function($scope, $http){
	$http.get("/event")
    .then(function(response) {
        $scope.event = response.data;
    });
    $http.get("/event/users")
    .then(function(response) {
        $scope.event_users = response.data;
    });
})