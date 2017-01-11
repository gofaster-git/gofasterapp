//CarrierResultsController
main.controller("CarrierResultsController", function ($scope, $http, $rootScope, $location) {
//window.alert("Entered");
//Assign the values from $rootScope
$scope.from_city = $rootScope.fromValue;
$scope.to_city = $rootScope.toValue;
$scope.rowCollection = [];
//Below function will calculate age from the given date of birth
$scope.getDateForAge = function (day,month,year) { // birthday is a date
    return new Date(day,month,year);
}
//Below function will get the carrier details for the selected to and from location(s).
$scope.loadCarriers = function(){
     $http.get('/loadCarriers',{params: { from: $scope.from_city, to: $scope.to_city }}).
        success(function(data)
        {
            $scope.rowCollection=data;
        });
}
$scope.loadCarriers();
});