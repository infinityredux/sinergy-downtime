mod = angular.module('sin.dtime.main', [
    'sin.fact',
    'sin.fact.actions',
    'sin.fact.lifestyle',
    'sin.fact.money',
    'sin.lib.persist'
]);

// --------------------------------------------------

mod.component('dtMain', {
    controller: DowntimeMainController,
    controllerAs: 'ctrl',
    templateUrl: 'core/template-main.html'
});

function DowntimeMainController($scope, dtime, actions, lifestyle, money, persist) {
    var ctrl = this;

    $scope.dtime = dtime;
    $scope.actions = actions;
    $scope.persist = persist;

    // TODO: delete these once I'm happy with the money & lifestyle
    // implementations and the other iterations.
    ctrl.money_link = money;
    ctrl.lifestyle_link = lifestyle;

    // --------------------------------------------------
    // General variables
    // --------------------------------------------------

    ctrl.help = {
        autoLoad: 'Automatically load the last saved data when the page is opened.',
        showHelp: 'Enable help descriptions, in addition to these tooltips, for extra context with certain selections.',
        direct: 'Submit the email to the downtime address, copied to your email; if disabled, will only be sent to your email.',
        player: 'Player',
        char:   'Character',
        email:  'Email',
        month:  'Month'
    };

    // --------------------------------------------------
    // User interactions
    // --------------------------------------------------

    ctrl.startChange = function() {
        actions.setCurrentMonth(dtime.month);
    };

    ctrl.monthChange = function() {
        alert('depreciated');
        actions.setMonths(ctrl.state.month_option);
    };

    ctrl.sendClick = function() {
        if (confirm('Submit downtime and wipe temporary data?')) {
            if (persist.isStorageAvailable()) {
                persist.eventWipe();
            }
        }
    };

    ctrl.resetClick = function() {
        if (confirm('Reset?')) {
            persist.eventReset();
        }
    };

    ctrl.loadClick = function() {
        if (confirm('This will revert to the last saved details. Are you sure?')) {
            persist.eventLoad();
        }
    };

    ctrl.saveClick = function() {
        if (persist.isStorageSaved()) {
            if (!confirm('Overwrite existing details?')) {
                return;
            }
        }
        if (persist.isStorageAvailable()) {
            persist.eventSave();
        } else {
            alert('Browser does not support HTML5 storage.');
        }
    };

    ctrl.impoClick = function() {
        alert('Importing');
    };

    ctrl.expoClick = function() {
        alert('Exporting');
    };
}