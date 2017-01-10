//auth controller
main.controller("AvailableController", function ($scope, $http, $rootScope, $location, $uibModalInstance,$timeout) {
    $scope.available = {};
	$scope.error_message = '';
    //login call to webapi (node implemented service)
    $scope.availableSave = function(){
        $http.post('/availableSave', {carrieravailable:$scope.available}).
        success(function(data)
        {
            if(data == 'success'){
                $uibModalInstance.close();
                alert('Carrier activated!');
            }
            else{
                alert('Some issue while saving the data');  
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