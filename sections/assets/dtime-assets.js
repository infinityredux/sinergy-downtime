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
    var ctrl = this;
    $scope.assets = assets;
    $scope.skills = skills;

    ctrl.createJob = function() {
        if (assets.job.level > -1)
            return;

        assets.job.level = 0;
    };

    ctrl.removeJob = function() {
        if (assets.job.level < 0)
            return;

        assets.resetJob();
    };

    ctrl.createContact = function() {
        assets.createContact();
    };

    ctrl.removeContact = function(id) {
        assets.deleteContact(id);
    };
}