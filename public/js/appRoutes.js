angular.module('appRoutes', []).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

	$routeProvider

		// home page
		.when('/', {
			templateUrl: 'views/home.html',
			controller: 'UserController',
			access: {restricted: true}
		})

		.when('/signup', {
			templateUrl: 'views/signup.html',
			controller: 'SignUpController',
			access: {restricted: false}
		})

		.when('/login', {
			templateUrl: 'views/login.html',
			controller: 'LoginController',
			access: {restricted: false}
		})

		.when('/logout', {
			controller: 'LogoutController',
			access: {restricted: true}
		})

		.when('/profile', {
			templateUrl: 'views/profile.html',
			controller: 'UserController',
			access: {restricted: true}
		})

    .when('/page', {
      templateUrl: 'views/page.html',
      controller: 'PageController',
      access: {restricted: true}
    })

    .when('/groups', {
      templateUrl: 'views/group.html',
      controller: 'UserController',
      access: {restricted: true}
    })

    .when('/create/group', {
      templateUrl: 'views/createGroup.html',
      controller: 'UserController',
      access: {restricted: true}
    })

    .when('/friend/', {
      templateUrl: 'views/friend.html',
      controller: 'UserController',
      access: {restricted: true}
    })

    .when('/user/:friend', {
      templateUrl: 'views/friendPage.html',
      controller: 'PageController',
      access: {restricted: true}
    })

    .when('/message', {
      templateUrl: 'views/message.html',
      access: {restricted: true}
    })

		.otherwise({
      redirectTo: '/'
    });

	$locationProvider.html5Mode(true);



}])

.run(function ($rootScope, $location, $route, UserService) {
  $rootScope.$on('$routeChangeStart',
    function (event, next, current) {
      UserService.getUserStatus()
        .then(function() {
          if (next.access.restricted && UserService.isLoggedIn() === false) {
            $location.path('/login');
            $route.reload();
          }
        });
  });
});