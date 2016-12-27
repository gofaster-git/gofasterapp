//auth controller
main.controller("CarrierResultsController", function ($scope, $http, $rootScope, $location) {
//window.alert("Entered");
//Assign the values from $rootScope
$scope.from_city = $rootScope.fromValue;
$scope.to_city = $rootScope.toValue;
$scope.rowCollection = [
        {firstName: 'Mani', lastName: 'R', birthDate: new Date('1987-05-21'), balance: 102, email: 'mani@gmail.com'},
        {firstName: 'Mani', lastName: 'R', birthDate: new Date('1987-04-25'), balance: -2323.22, email: 'mani@gmail.com'},
        {firstName: 'Mani', lastName: 'R', birthDate: new Date('1955-08-27'), balance: 42343, email: 'mani@gmail.com'}
    ];
//     $scope.user = {username: '', password: ''};
// 	$scope.error_message = '';
//     //login call to webapi (node implemented service)
//     $scope.login = function(){
// 		$http.post('/auth/login', $scope.user).success(function(data){
// 			if(data.state == 'success'){
// 				$rootScope.authenticated = true;
// 				$rootScope.current_user = data.user.username;
// 				$rootScope.sess = data.user;
// 				sessionStorage.setItem('current_user', $rootScope.sess.username);
// 				$location.path('/');
// 			}
// 			else{
// 				$scope.error_message = data.message;
// 				$rootScope.sess = null;
// 			}
// 		});
// 	};
//   //login call to webapi (node implemented service)
// 	$scope.register = function(){
// 		console.log($scope.user);
// 		$http.post('/auth/signup', $scope.user).success(function(data){
// 			if(data.state == 'success'){
// 				$rootScope.authenticated = true;
// 				$rootScope.current_user = data.user.username;
// 				$location.path('/');
// 			}
// 			else{
// 				$scope.error_message = data.message;
// 			}
// 		});
// 	};
});