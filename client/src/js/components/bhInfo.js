angular.module('opensigl.components')
  .component('bhInfo', {
    template :
      '<span '
      + '  class="text-info bi bi-info-circle" '
      + '  uib-popover-template="$ctrl.template" '
      + '  popover-placement="right" '
      + '  popover-append-to-body="true" '
      + '  popover-trigger="\'mouseenter\'"> '
      + '</span> ',
    bindings : {
      template  : '@',
      direction : '@',
    },
  });
