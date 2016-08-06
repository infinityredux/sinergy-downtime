// Code goes here

mod = angular.module('sin.dtime.lifestyle', [
  'sin.fact.lifestyle',
  'sin.lib.persist'
  ]);

mod.component('dtLifestyle', {
    controller: LifestyleController,
    controllerAs: 'ctrl',
    templateUrl: 'fragments/lifestyle.html'
});

function LifestyleController ($scope, lifestyle) {
    //var ctrl = this;
    $scope.lifestyle = lifestyle;
}
