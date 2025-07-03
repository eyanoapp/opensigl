angular.module('opensigl.services')
  .service('SupplierService', SupplierService);

SupplierService.$inject = ['PrototypeApiService'];

function SupplierService(Api) {
  const service = new Api('/suppliers/');
  return service;
}
