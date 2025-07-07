angular.module('opensigl.components').component('osLayout', {
  templateUrl : 'js/components/osigl/osLayout/osLayout.html',
  controller : OsLayoutController,
  transclude : true,
  bindings : {},
});

OsLayoutController.$inject = ['SessionService'];

function OsLayoutController(Session) {
  const $ctrl = this;

  $ctrl.getEnterpriseLogo = () => {
    return Session.enterprise && Session.enterprise.logo
      ? Session.enterprise.logo
      : 'assets/icon.png';
  };

  $ctrl.$onInit = function onInit() {};
}
