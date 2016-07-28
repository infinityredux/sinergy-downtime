// Code goes here
// Note to self:
// https://docs.angularjs.org/guide/directive
// http://blog.thoughtram.io/angularjs/2015/01/02/exploring-angular-1.3-bindToController.html
//
// http://www.w3schools.com/angular/angular_sql.asp
//
// http://newrelic.com/
// http://ibm-bluemix.coderpower.com/?utm_source=carbon&utm_medium=ads&utm_content=&utm_campaign=nordic#/
//

mod = angular.module('sin.dtime', [
    'sin.dtime.actions',
    'sin.dtime.equip',
    'sin.dtime.lifestyle',
    'sin.dtime.money',
    'sin.dtime.skills',
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

/*mod.factory('dtime', function(persist) {
  
});*/

mod.directive('dtMain', function() {
  return {
    restrict: 'E',
    scope: {
      dtime: '='
    },
    templateUrl: 'fragments/dtime.html'
  };
});

mod.directive('dtEvents', function() {
  return {
    restrict: 'E',
    scope: {
      dtime: '='
    },
    templateUrl: 'fragments/dtime-events.html'
  };
});

mod.controller('DowntimeController', function($scope, actions, lifestyle, money, persist) {
  var dc = this;
  var ctrl = this;
  
  $scope.actions = actions;
  
  dc.state = {};
  dc.data = {};
  
  dc.data.months =[
    { num: 0,  month: 'January' },
    { num: 1,  month: 'February' },
    { num: 2,  month: 'March' },
    { num: 3,  month: 'April' },
    { num: 4,  month: 'May' },
    { num: 5,  month:'June' },
    { num: 6,  month: 'July' },
    { num: 7,  month: 'August' },
    { num: 8,  month: 'September' },
    { num: 9,  month: 'October' },
    { num: 10, month: 'November' },
    { num: 11, month: 'December' }
  ];

  // --------------------------------------------------
  // General variables
  // --------------------------------------------------

  dc.persist = persist;
  
  // TODO: delete these once I'm happy with the money & lifestyle
  // implementations and the other iterations.
  dc.money_link = money;
  dc.lifestyle_link = lifestyle;

  dc.load = false;
  dc.direct = true;
  dc.helpon = true;
  
  dc.player = "";
  dc.char = "";
  dc.email = "";
  dc.events = "";
  dc.minor = "";
  
  ctrl.help = {
    auto_load: 'Automatically load the last saved data when the page is opened.',
    direct: 'Submit the email to the downtime address, copied to your email; if disabled, will only be sent to your email.',
    helpon: 'Enable help descriptions, in addition to these tooltips, for extra context with certain selections.',
    player: 'Player',
    char:   'Character',
    email:  'Email',
    month:  'Month'
  };
  
  var defaultState = function() {
    ctrl.state.current_tab = 'none';
    ctrl.state.month_num = actions.getCurrentMonth();
    //ctrl.state.month_option = actions.getMonths();
  };
  
  defaultState();

  // --------------------------------------------------
  // Storage functions
  // --------------------------------------------------

  // Done to resolve bug with load event called before the functions registered
  // in other modules are set up.
  if (persist.isStorageAvailable()) {
    if (persist.isStorageSaved()) {
      if (JSON.parse(localStorage.load)) {
        persist.setAutoLoad();
      }
    }
  }

  // --------------------------------------------------

  persist.registerLoad(function() {
    // Permanent details
    dc.load   = JSON.parse(localStorage.load);
    dc.direct = JSON.parse(localStorage.direct);
    dc.helpon = JSON.parse(localStorage.helpon);
    dc.player = localStorage.player;
    dc.char   = localStorage.char;
    dc.email  = localStorage.email;
      
    // Temporary details
    dc.events = localStorage.events;
    dc.minor  = localStorage.minor;
  });

  persist.registerSave(function() {
    // Permanent details
    localStorage.saved  = true;
    localStorage.load   = dc.load;
    localStorage.direct = dc.direct;
    localStorage.helpon = dc.helpon;
    localStorage.player = dc.player;
    localStorage.char   = dc.char;
    localStorage.email  = dc.email;
      
    // Temporary details
    localStorage.events    = dc.events;
    localStorage.minor     = dc.minor;
  });
  
  persist.registerLoad(function() {
    ctrl.state = persist.doLoad('sin.dtime:state', ctrl.state);
  });

  persist.registerSave(function() {
    persist.doSave('sin.dtime:state', ctrl.state);
  });

  persist.registerWipe(function() {
    dc.events    = "";
    dc.minor     = "";
    defaultState();
  });

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
  
  dc.sendClick = function() {
    if (confirm('Submit downtime and wipe temporary data?')) {
      if (persist.isStorageAvailable()) {
        persist.eventWipe();
      }
    }
  };
  
  dc.resetClick = function() {
    if (confirm('Reset?')) {
      persist.eventReset();
    }
  };

  dc.loadClick = function() {
    if (confirm('This will revert to the last saved details. Are you sure?')) {
      persist.eventLoad();
    }
  };
  
  dc.saveClick = function() {
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
  
  dc.impoClick = function() {
    alert('Importing');
  };

  dc.expoClick = function() {
    alert('Exporting');
  };
});
