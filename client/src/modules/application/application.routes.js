angular.module('opensigl.routes')
  .config(['$stateProvider', $stateProvider => {
    $stateProvider
      .state('index', {
        url         : '/',
        controller  : 'HomeController as HomeCtrl',
        templateUrl : 'modules/home/home.html',
        data : { allowAuthPassthrough : true },
      });
  }]);
