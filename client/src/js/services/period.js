angular.module('opensigl.services')
  .service('PeriodApi', PeriodApi);

PeriodApi.$inject = ['PrototypeApiService'];

function PeriodApi(Api) {
  const service = new Api('/periods/');
  return service;
}
