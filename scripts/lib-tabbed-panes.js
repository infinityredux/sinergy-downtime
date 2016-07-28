// Code goes here

var mod = angular.module("sin.lib.panes", []);

mod.directive('sinTabbedPanes', function() {
  return {
    restrict: 'E',
    scope: true,
    bindToController: {
      initial: '@'
    },
    transclude: true,
    template: '<span ng-transclude></span>',
    controllerAs: 'tabCtrl',
    controller: function() {
      this.current = this.initial;
      this.isCurrent = function(test) {
        return (test == this.current);
      };
      this.setCurrent = function(change) {
        this.current = change;
      };
    }
  };
});

mod.directive('sinPaneLink', function() {
  return {
    require: '^^sinTabbedPanes',
    restrict: 'E',
    scope: {
      tab: '@',
      action: '&'
    },
    transclude: true,
    template: '<span ng-transclude ng-click="doClick()" ng-class="getClass()"></span>',
    link: function(scope, elem, attrs, tabCtrl) {
      scope.doClick = function() {
        tabCtrl.setCurrent(attrs.tab);
        if (attrs.action !== undefined) {
          //attrs.action();
          //alert(attrs.action);
          scope.action();
        }
      };
      scope.getClass = function() {
        if (tabCtrl.isCurrent(attrs.tab)) {
          return 'pane-link-active';
        }
        else {
          return 'pane-link-passive';
        }
      };
    }
  };
});

mod.directive('sinPane', function() {
  return {
    require: '^^sinTabbedPanes',
    restrict: 'E',
    scope: {
      tab: '@'
    },
    transclude: true,
    template: '<span ng-transclude ng-show="canShow()"></span>',
    link: function(scope, elem, attrs, tabCtrl) {
      scope.canShow = function() {
        return tabCtrl.isCurrent(attrs.tab) || tabCtrl.isCurrent('all');
      };
    }
  };
});
