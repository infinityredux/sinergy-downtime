// Code goes here

mod = angular.module('sin.dtime.lifestyle', [
  'sin.fact.lifestyle',
  'sin.fact.persist',
  ]);

mod.directive('dtLifestyle', function() {
  return {
    restrict: 'E',
    scope: {
      dtime: '=',
    },
    templateUrl: 'fragments/dtime-lifestyle.html',
  };
});

mod.controller('LifestyleController', function(lifestyle) {
  var c = this;
});
