// Code goes here

mod = angular.module('sin.dtime.lifestyle', ['sin.fact.lifestyle']);

mod.component('dtLifestyle', {
    controller: LifestyleController,
    controllerAs: 'ctrl',
    templateUrl: 'sections/lifestyle/template-lifestyle.html'
});

function LifestyleController ($scope, lifestyle) {
    //var ctrl = this;
    $scope.lifestyle = lifestyle;
}
