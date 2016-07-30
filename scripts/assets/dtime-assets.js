mod = angular.module('sin.dtime.assets', ['sin.fact.assets']);

mod.component('dtAssets', {
    controller: AssetsController,
    controllerAs: 'ctrl',
    templateUrl: 'fragments/assets.html'
});

function AssetsController($scope, assets) {
    $scope.assets = assets;
}