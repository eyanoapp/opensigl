const bhPanelOverlayTemplate = `
<div class="card-overlay">
  <div class="card-overlay-container">
    <span class="card-overlay-text" ng-transclude>
    </span>
  </div>
</div>
`;

angular.module('opensigl.components')
  .component('bhPanelOverlay', {
    transclude : true,
    template : bhPanelOverlayTemplate,
  });
