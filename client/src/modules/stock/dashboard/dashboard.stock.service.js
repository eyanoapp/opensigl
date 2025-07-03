angular.module('opensigl.services')
  .factory('StockDashboardService', StockDashboardService);

StockDashboardService.$inject = ['$http', 'util'];

function StockDashboardService($http, util) {
  const service = {};
  const baseUrl = '/stock/dashboard';

  service.read = read;

  function read(options) {
    return $http.get(baseUrl, { params : options })
      .then(util.unwrapHttpResponse);
  }

  return service;
}
