// Code goes here

mod = angular.module('sin.dtime.money', [
  'sin.fact.money',
  ]);

mod.directive('dtMoney', function() {
  return {
    restrict: 'E',
    scope: {
      dtime: '=',
    },
    templateUrl: 'iota.dtime-money.html',
  };
});

mod.controller('MoneyController', function($scope, money) {
  var c = this;
  $scope.money = money;
});
