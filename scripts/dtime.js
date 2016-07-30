// Code goes here
//
// Note to self:
// http://blog.thoughtram.io/angularjs/2015/01/02/exploring-angular-1.3-bindToController.html
// http://www.w3schools.com/angular/angular_sql.asp
//
// http://newrelic.com/
//

mod = angular.module('sin.dtime', [
    'sin.dtime.actions',
    'sin.dtime.equip',
    'sin.dtime.events',
    'sin.dtime.lifestyle',
    'sin.dtime.money',
    'sin.dtime.skills',
    'sin.fact',
    'sin.fact.actions',
    'sin.fact.assets',
    'sin.fact.equip',
    'sin.fact.lifestyle',
    'sin.fact.money',
    'sin.fact.skills',
    'sin.lib.general',
    'sin.lib.persist',
    'sin.lib.panes'
]);

// --------------------------------------------------

mod.component('dtForm', {
    controller: DowntimeFormController,
    templateUrl: 'fragments/dtime-form.html'
});

function DowntimeFormController($scope, dtime) {
    $scope.dtime = dtime;
}

// --------------------------------------------------

mod.component('dtMain', {
    controller: DowntimeMainController,
    controllerAs: 'ctrl',
    templateUrl: 'fragments/dtime-main.html'
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
    // Storage functions
    // --------------------------------------------------

    // Done to resolve bug with load event called before the functions registered
    // in other modules are set up
    // TODO Does this definitely still work? with the dtime module? if not can implement work around
    if (persist.isStorageAvailable()) {
        if (persist.isStorageSaved()) {
            //if (JSON.parse(localStorage.load)) {
            if (dtime.autoLoad) {
                persist.setAutoLoad();
            }
        }
    }

    // --------------------------------------------------
    // User interactions
    // --------------------------------------------------

    ctrl.startChange = function() {
        actions.setCurrentMonth(ctrl.state.month_num);
    };
  
    ctrl.monthChange = function() {
        actions.setMonths(ctrl.state.month_option);
    };
  
    ctrl.paneChange = function(change) {
        ctrl.state.current_tab = change;
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
