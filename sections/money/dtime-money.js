// Code goes here

mod = angular.module('sin.dtime.money', ['sin.fact.money']);

mod.directive('dtMoney', function() {
  return {
    restrict: 'E',
    templateUrl: 'sections/money/template-money.html'
  };
});

mod.controller('MoneyController', function($scope, money) {
  //var ctrl = this;
  $scope.money = money;
});
