mod = angular.module('sin.dtime.form', [
    'sin.dtime',
    'sin.fact'
]);

// --------------------------------------------------

mod.component('dtForm', {
    controller: DowntimeFormController,
    controllerAs: 'ctrl',
    templateUrl: 'fragments/dtime-form.html'
});

function DowntimeFormController($scope, dtime) {
    var ctrl = this;
    $scope.dtime = dtime;

    // --------------------------------------------------
    // User interactions
    // --------------------------------------------------

    ctrl.paneChange = function(change) {
        dtime.currentTab = change;
    };
}
