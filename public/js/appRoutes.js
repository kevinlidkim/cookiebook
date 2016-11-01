angular.module('appRoutes', []).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

  $routeProvider

    .when('/', {
      templateUrl: 'views/home.html',
      controller: 'MainController'
    })

    .when('/persons', {
      templateUrl: 'views/persons.html',
      controller: 'PersonController'
    });

  $locationProvider.html5Mode(true);

}]);