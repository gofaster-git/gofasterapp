//auth controller
main.controller("AuthController", function ($scope, $http, $rootScope, $location, $uibModalInstance,$timeout) {
    $scope.user = {username: '', password: ''};
		
	$scope.error_message = '';
    //login call to webapi (node implemented service)
    $scope.login = function(){
		$http.post('/auth/login', $scope.user).success(function(data){
			if(data.state == 'success'){
				$rootScope.authenticated = true;
				$rootScope.current_fullname = data.user.fullname;
				$rootScope.current_user = data.user.username;
				$rootScope.sess = data.user;
				sessionStorage.setItem('current_user', $rootScope.sess.username);
				$location.path('/');
				$uibModalInstance.close();
				$rootScope.successTextAlert = "Login successful.";
				$rootScope.showSuccessAlert=true;
				$timeout(function() {
					$rootScope.showSuccessAlert = false;
				}, 3000)
			}
			else{
				$scope.error_message = data.message;
				$rootScope.sess = null;
			}
		});
	};
  //login call to webapi (node implemented service)
	$scope.register = function(){
		console.log($scope.user);
		$http.post('/auth/signup', $scope.user).success(function(data){
			if(data.state == 'success'){
				$rootScope.authenticated = true;
				$rootScope.current_user = data.user.username;
				$rootScope.current_fullname = data.user.fullname;
				$location.path('/');
				$uibModalInstance.close();
				$rootScope.successTextAlert = "Registration successful.";
				$rootScope.showSuccessAlert=true;
				$timeout(function() {
					$rootScope.showSuccessAlert = false;
				}, 3000)
			}
			else{
				$scope.error_message = data.message;
			}
		});
	};
	//Below code will handles the modal actions
	$scope.close = function(){
		$uibModalInstance.close();
	};
	// $scope.user.username='';
	// $scope.user.password='';
});