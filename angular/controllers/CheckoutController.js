main.controller("CheckoutController", function ($scope, $http, $rootScope, $location, $timeout) {
$scope.carrier = {};
$scope.sender = {};
if($rootScope.current_user == 'Guest')
{
    $scope.isPassword=true;
}
else
{
    $scope.isPassword=false;
}
//Check for $rootScope.checkoutdata data, get the data and clear the object.
if($rootScope.checkoutdata)
{
    //Continue if data exisists
    $scope.carrier.fullname=$rootScope.checkoutdata.personalinfo[0].first_name +' '+$rootScope.checkoutdata.personalinfo[0].last_name
    $scope.carrier.amount="50 £";
}
else
{
    //Send back the user to home page 
    $location.path('/home');
}
$scope.testClick = function(){
    $location.path('/home');
    $rootScope.checkoutdata = "";
    if($scope.isPassword){$scope.register();}
}
//login call to webapi (node implemented service)
$scope.register = function(){
    console.log($scope.sender);
    //$scope.user=$scope.sender;
    $http.post('/auth/signup', $scope.sender).success(function(data){
        if(data.state == 'success'){
            $rootScope.authenticated = true;
            $rootScope.current_user = data.user.username;
            $rootScope.current_fullname = data.user.fullname;
        }
        else{
            //Restrict user to proceed with the payment
        }
    });
};
});