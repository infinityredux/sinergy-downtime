// Code goes here

mod = angular.module('sin.ext.util', []);

mod.directive('sinFieldset', function() {
  return {
    restrict: 'E',
    transclude: true,
    scope: {
      legend: '@',
      collapsed: '@',
    },
    templateUrl: 'iota.ext-util-fieldset.html',
    link: function(scope, element, attrs, controllers) {
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
    },
  };
});

mod.directive('sinHelp', function() {
  return {
    restrict: 'E',
    transclude: true,
    scope: {
      show: '=',
      help: '=',
    },
    template: '<span class="help-box" ng-attr-title="{{help}}">[?]</span>',
/*    link: function(scope, element, attrs){
      $(element).hover(function(){
        $(element).tooltip('show');
      }, function(){
        $(element).tooltip('hide');
      });
    },*/
  };
});