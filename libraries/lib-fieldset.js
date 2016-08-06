// Code goes here

mod = angular.module('sin.lib.fieldset', []);

mod.directive('sinFieldset', function() {
  return {
    restrict: 'E',
    transclude: true,
    scope: {
      legend: '@',
      collapsed: '@'
    },
    templateUrl: 'libraries/template-fieldset.html',
    link: function(scope, element, attrs) {
      scope.test = attrs;
      scope.hide = (attrs.collapsed == "true");
      scope.fieldsetLegend = attrs.legend;
      
      if(scope.hide) {
        element.children().addClass("fieldset-closed");
      } else {
        element.children().addClass("fieldset-open");
      }
      
      scope.toggleCollapse = function() {
        scope.hide = !scope.hide;
        if(scope.hide) {
          element.children().addClass("fieldset-closed");
          element.children().removeClass("fieldset-open");
        } else {
          element.children().addClass("fieldset-open");
          element.children().removeClass("fieldset-closed");
        }
      };
    }
  };
});
