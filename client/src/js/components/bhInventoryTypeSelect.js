angular.module('opensigl.components')
  .component('bhInventoryTypeSelect', {
    templateUrl : 'modules/templates/bhInventoryTypeSelect.tmpl.html',
    controller  : InventoryTypeSelectController,
    transclude  : true,
    bindings    : {
      typeId        : '<',
      onSelectCallback : '&',
    },
  });

InventoryTypeSelectController.$inject = [
  'InventoryService', 'NotifyService',
];

/**
 * Inventory Type Select Controller
 *
 */
function InventoryTypeSelectController(Inventory, Notify) {
  const $ctrl = this;

  $ctrl.$onInit = function onInit() {

    Inventory.Types.read()
      .then((types) => {
        $ctrl.types = types;
      })
      .catch(Notify.handleError);
  };

  // fires the onSelectCallback bound to the component boundary
  $ctrl.onSelect = function ($item) {
    $ctrl.onSelectCallback({ type : $item });
  };
}
