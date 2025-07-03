angular.module('opensigl.routes')
  .config(['$stateProvider', $stateProvider => {
    $stateProvider
      .state('tags', {
        url         : '/tags',
        controller  : 'TagsController as TagsCtrl',
        templateUrl : 'modules/tags/tags.html',
      });
  }]);
