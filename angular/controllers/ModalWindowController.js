//main controller
main.controller("ModalWindowController", function ($scope, $rootScope, $uibModalInstance) {
    
  $scope.ok = function(){
     $scope.resetToFromValue();
      $uibModalInstance.close();
    };
});