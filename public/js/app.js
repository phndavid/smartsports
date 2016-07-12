angular.module('app', ['ngRoute'])
.config(['$routeProvider', '$locationProvider',
  function($routeProvider, $locationProvider) {
         $routeProvider
            .when('/Overall',{
            	templateUrl: 'views/overall.html'
            })
            .when('/Top10',{
              templateUrl: 'views/topten.html'
            })
            .when('/Stage/:stageId',{
            	templateUrl: 'views/stage.html',
            })
            .otherwise({
		      redirectTo: 'Overall'
		   	});
         //	$locationProvider.html5Mode(true);
 }])
.factory('StageFactory', function($http){
  return {
  	getResults: function(){
  		return $http.get("/event/users/results");
  	} 
  };
})
.controller('StageCtrl', function($scope, $routeParams, $http, StageFactory) {
  this.name = "StageCtrl";
  this.params = $routeParams;
  $scope.event_users_results = [];
    var handleSuccess = function(data, status) {
        $scope.event_users_results = data;
        console.log($scope.event_users_results);
    };
  StageFactory.getResults().success(handleSuccess);
  $http.get("/Stage?id="+this.params)
    .then(function(response) {
        $scope.stage_result = response.data;
  });

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