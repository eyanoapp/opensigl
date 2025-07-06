const stockExitTypeTmpl = `
  <div class="row g-3">
    <div class="col-sm-6 col-md-3" ng-repeat="type in $ctrl.types track by type.label">
      <div
        type="button"
        id="entry-exit-type-{{type.label}}"
        class="card card-one border"
        ng-class="{ 'bg-primary-subtle border-primary' : $ctrl.isTypeSelected(type) }"
        ng-click="$ctrl.selectExitType(type)"
      >
        <div class="card-body overflow-hidden text-center">
          <h2 class="card-value text-primary" translate><i ng-class="type.icon"></i></h2>
          <h3 class="text-dark text-uppercase fw-semibold mb-1" translate>{{type.labelKey}}</h3>
          <span class="fs-xs text-secondary mb-0 lh-4" ng-hide="$ctrl.isTypeSelected(type)" translate>
            {{type.descriptionKey}}
          </span>
          <span class="fs-xs text-secondary mb-0 lh-4" ng-show="$ctrl.isTypeSelected(type)" translate>
            {{$ctrl.destinationLabel}}
          </span>
        </div>
      </div>
    </div>
  </div>

  <div ng-if="$ctrl.hasNoTypesDefined">
    <p class="alert alert-danger">
      <i class="bi bi-warning"></i>
      <span translate translate-values="$ctrl.depot">STOCK.NO_EXIT_TYPES</span>
    </p>
  </div>
`;

angular.module('opensigl.components')
  .component('bhStockExitType', {
    template : stockExitTypeTmpl,
    controller : StockExitTypeController,
    bindings : {
      onSelectCallback : '&',
      depot : '<?',
      exitType : '<?',
      selectedExitType : '=',
      destinationLabel : '=',
    },
  });

StockExitTypeController.$inject = ['StockEntryExitTypeService', 'NotifyService'];

/**
 * Stock Entry Exit Type component
 *
 */
function StockExitTypeController(TypeService, Notify) {
  const $ctrl = this;
  const types = TypeService.exitTypes;

  $ctrl.$onInit = function onInit() {
    reloadExitTypes();
  };

  $ctrl.$onChanges = function onChanges(changes) {
    if (changes.depot) {
      reloadExitTypes();
    }

    // when the exit type is cleared, reload exit types
    if (changes.exitType?.currentValue === undefined) {
      reloadExitTypes();
    }
  };

  /**
   * @function selectExitType
   *
   * @description
   * This function uses the callback specified by the exit types to load
   * the entity information, pick up the formatting for the label, then pass
   * everything back to the stock exit controller.  This way, the view/display
   * logic is contained here, but the functional logic is kept in the stock exit
   * controller.
   */
  $ctrl.selectExitType = (type) => {
    // this prevents us looking up a patient uuid in the service route
    const shouldLookupEntity = angular.equals(type, $ctrl.selectedExitType);

    $ctrl.selectedExitType = type;

    $ctrl.destinationLabel = $ctrl.entity
      ? type.formatLabel($ctrl.entity)
      : type.descriptionKey;

    const entityUuid = shouldLookupEntity && $ctrl.entity?.uuid;

    return type.callback($ctrl.depot, entityUuid)
      .then(entity => {
        if (!entity) {
          $ctrl.selectedExitType = {};
          $ctrl.destinationLabel = type.descriptionKey;
          return null;
        }

        $ctrl.entity = entity;
        $ctrl.destinationLabel = type.formatLabel($ctrl.entity);
        return $ctrl.onSelectCallback({ type, entity });
      })
      .catch(Notify.handleError);
  };

  /**
   * @function isTypeSelected
   *
   * @description
   * Checks to see if the type is selected
   */
  $ctrl.isTypeSelected = (type) => {
    return angular.equals(type.label, $ctrl.selectedExitType?.label);
  };

  /**
   * @function reloadExitTypes
   *
   * @description
   * Clears the previously selected types.
   */
  function reloadExitTypes() {

    // clear old data
    $ctrl.selectedExitType = {};
    $ctrl.destinationLabel = '';
    delete $ctrl.entity;

    if (!$ctrl.depot) { return; }

    // get the final types by filtering on what is allowed in the depot
    $ctrl.types = types
      .filter(type => $ctrl.depot[type.allowedKey]);

    $ctrl.hasNoTypesDefined = ($ctrl.types.length === 0);
  }
}
