angular.module('opensigl.controllers')
  .controller('IprTaxConfigModalController', IprTaxConfigModalController);

IprTaxConfigModalController.$inject = [
  '$state', '$q', 'IprTaxService', 'NotifyService', 'appcache', 'params',
];

function IprTaxConfigModalController($state, $q, IprTax, Notify, AppCache, params) {
  const vm = this;
  vm.iprTax = {};

  const cache = AppCache('IprTaxConfigModal');

  if (params.isCreateState || params.id) {
    vm.stateParams = params;
    cache.stateParams = params;
  } else {
    vm.stateParams = cache.stateParams;
  }

  vm.isCreateState = vm.stateParams.isCreateState;

  // exposed methods
  vm.submit = submit;

  function startup() {
    vm.loading = true;

    // both edit and create state
    $q.all([
      IprTax.read(vm.stateParams.taxIprId),
      IprTax.Config.read(null, { taxe_ipr_id : vm.stateParams.taxIprId }),
    ])
      .then(([iprTax, iprConfig]) => {
        iprTax.taxe_ipr_id = iprTax.id;
        delete iprTax.id;

        vm.iprTax = iprTax;
        vm.iprConfig = iprConfig;

        // edit state only
        if (!vm.isCreateState) {
          return IprTax.Config.read(vm.stateParams.id)
            .then(iprTaxData => { vm.iprTax = iprTaxData; });
        }

        return 0;
      })
      .catch(Notify.handleError)
      .finally(() => { vm.loading = false; });
  }

  // submit the data to the server from all two forms (update, create)
  function submit(iprTaxForm) {
    if (iprTaxForm.$invalid) { return 0; }

    const iprConfigData = IprTax.Config.configData(vm.iprTax, vm.iprConfig);

    const promise = (vm.isCreateState)
      ? IprTax.Config.create(iprConfigData)
      : IprTax.Config.update(vm.iprTax.id, iprConfigData);

    return promise
      .then(() => {
        const translateKey = (vm.isCreateState) ? 'FORM.INFO.CREATE_SUCCESS' : 'FORM.INFO.UPDATE_SUCCESS';
        Notify.success(translateKey);
        $state.go('iprConfiguration', null, { reload : true });
      })
      .catch(Notify.handleError);
  }

  startup();
}
