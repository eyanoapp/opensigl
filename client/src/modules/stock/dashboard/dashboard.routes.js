angular.module('opensigl.routes')
  .config(['$stateProvider', $stateProvider => {
    $stateProvider
      .state('/stock/dashboard', {
        url : '/stock/dashboard',
        controller : 'StockDashBoardController as StockDashBoardCtrl',
        templateUrl : 'modules/stock/dashboard/dashboard.html',
      });
  }]);
