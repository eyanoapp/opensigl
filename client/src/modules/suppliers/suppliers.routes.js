angular.module('opensigl.routes')
  .config(['$stateProvider', ($stateProvider) => {
    $stateProvider
      .state('suppliers', {
        url         : '/suppliers',
        controller  : 'SupplierController as SupplierCtrl',
        templateUrl : '/modules/suppliers/suppliers.html',
      });
  }]);
