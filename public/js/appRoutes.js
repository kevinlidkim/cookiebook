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
			controller: 'SignUpController'
		})

		.when('/login', {
			templateUrl: 'views/login.html',
			controller: 'LoginController'
		})

		.when('/logout', {
			controller: 'LogOutController'
		})

		.when('/profile', {
			templateUrl: 'views/profile.html',
			controller: 'UserController'
		});

	$locationProvider.html5Mode(true);

}]);