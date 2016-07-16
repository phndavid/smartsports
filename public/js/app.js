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
              redirectTo: 'Top10'
            });
         // $locationProvider.html5Mode(true);
 }])
.controller('StageCtrl', function($scope, $routeParams, $http) {
  this.name = "StageCtrl";
  var race_id = $routeParams;
  $http.get("/Stage?id="+race_id.stageId)
    .then(function(response) {
        $scope.stage_result = response.data;
        console.log($scope.stage_result)
  });
})
.controller('OverallCtrl', function($scope, $http){
  $http.get("/Overall?bracket=overall")
      .then(function(response) {
        $scope.overall_result = response.data;
  });
  $("#select").on('change', function() {
    var value = $(this).children(":selected").attr("value");
    console.log(value);
    $http.get("/Overall?bracket="+value)
    .then(function(response) {
      $scope.overall_result = response.data;
        console.log(response.data);
  });
  });
})