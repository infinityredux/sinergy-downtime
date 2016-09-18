mod = angular.module('sin.dtime.assets', [
    'sin.fact.assets',
    'sin.fact.skills'
]);

mod.component('dtAssets', {
    controller: AssetsController,
    controllerAs: 'ctrl',
    templateUrl: 'sections/assets/template-assets.html'
});

function AssetsController($scope, assets, skills) {
    $scope.assets = assets;
    $scope.skills = skills;
    $scope.actSlot = {};
}