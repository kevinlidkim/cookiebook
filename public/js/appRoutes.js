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

    .when('/group/:group', {
      templateUrl: 'views/groupPage.html',
      controller: 'PageController',
      access: {restricted: true}
    })

	.when('/editGroup/:group', {
		templateUrl: 'views/groupEdit.html',
		controller: 'PageController',
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

    .when('/createMessage/:user', {
      templateUrl: 'views/createMessage.html',
      controller: 'UserController',
      access: {restricted: true}
    })

    .when('/message', {
      templateUrl: 'views/message.html',
      controller: 'UserController',
      access: {restricted: true}
    })

    .when('/advertisements', {
      templateUrl: 'views/advertisement.html',
      controller: 'EmployeeController',
      access: {restricted: true}
    })

    .when('/customers', {
      templateUrl: 'views/customer.html',
      controller: 'EmployeeController',
      access: {restricted: true}
    })

    .when('/editCustomer', {
      templateUrl: 'views/editCustomer.html',
      controller: 'EmployeeController',
      access: {restricted: true}
    })

    .when('/purchaseItem', {
      templateUrl: '/views/purchaseItem.html',
      controller: 'UserController',
      access: {restricted: true}
    })

    .when('/purchaseSuccess', {
      templateUrl: '/views/purchaseSuccess.html',
      access: {restricted: true}
    })

    .when('/sales', {
      templateUrl: 'views/sales.html',
      controller: 'ManagerController',
      access: {restricted: true}
    })

    .when('/employees', {
      templateUrl: 'views/employee.html',
      controller: 'ManagerController',
      access: {restricted: true}
    })

    .when('/editEmployee', {
      templateUrl: 'views/editEmployee.html',
      controller: 'ManagerController',
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
          if (next.access.restricted && UserService.isAuth() === false) {
            $location.path('/login');
            $route.reload();
          }
        });
  });
});
