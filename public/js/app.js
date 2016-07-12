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
.factory('OverallFactory', function($http){
  return {
  	getResults: function(){
  		return $http.get("/Overall");
  	} 
  };
})
.controller('StageCtrl', function($scope, $routeParams, $http) {
  this.name = "StageCtrl";
  var race_id = $routeParams;
  $http.get("/Stage?id="+race_id.stageId)
    .then(function(response) {
        $scope.stage_result = response.data;
        console.log($scope.stage_result)
  });
})
.controller('OverallCtrl', function($scope, $http, OverallFactory){
  $scope.event_users_results = [];
    var handleSuccess = function(data, status) {
        $scope.event_users_results = data;
        console.log($scope.event_users_results);
    };
  OverallFactory.getResults().success(handleSuccess);
})