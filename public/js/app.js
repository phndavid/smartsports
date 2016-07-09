angular.module('app', ['ngRoute'])
.config(['$routeProvider', '$locationProvider',
  function($routeProvider, $locationProvider) {
         $routeProvider
            .when('/Athlete',{
            	templateUrl: 'views/athlete.html'
            })
            .when('/Stage/:stageId',{
            	templateUrl: 'views/stage.html',
            })
            .otherwise({
		      redirectTo: 'Athlete'
		   	});
         	$locationProvider.html5Mode(true);
 }])
.factory('StageFactory', function($http){
  return {
  	getResults: function(){
  		return $http.get("/event/users/results");
  	} 
  };
})
.controller('StageCtrl', function($scope, $routeParams, StageFactory) {
  this.name = "StageCtrl";
  this.params = $routeParams;
   $scope.event_users_results = [];

    var handleSuccess = function(data, status) {
        $scope.event_users_results = data;
        console.log($scope.event_users_results);
    };
  StageFactory.getResults().success(handleSuccess);
})
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