angular.module('appRoutes', []).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

	$routeProvider

		// home page
		.when('/', {
			templateUrl: 'views/home.html',
			controller: 'MainController'
		})

		.when('/persons', {
			templateUrl: 'views/person.html',
			controller: 'PersonController'
		})

		.when('/signup', {
			templateUrl: 'views/signup.html',
			controller: 'AuthController'
		})

		.when('/login', {
			templateUrl: 'views/login.html',
			controller: 'AuthController'
		});

	$locationProvider.html5Mode(true);

}]);