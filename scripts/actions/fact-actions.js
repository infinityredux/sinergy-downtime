// Code goes here

mod = angular.module('sin.fact.actions', ['sin.fact.persist']);

mod.factory('actions', function(persist) {
  var factory = {};
  var state = {};
  
  factory.data = {
    months: [
      {short: 'Jan', med: 'Jan',   long: 'January'},
      {short: 'Feb', med: 'Feb',   long: 'February'},
      {short: 'Mar', med: 'March', long: 'March'},
      {short: 'Apr', med: 'April', long: 'April'},
      {short: 'May', med: 'May',   long: 'May'},
      {short: 'Jun', med: 'June',  long: 'June'},
      {short: 'Jul', med: 'July',  long: 'July'},
      {short: 'Aug', med: 'Aug',   long: 'August'},
      {short: 'Sep', med: 'Sept',  long: 'September'},
      {short: 'Oct', med: 'Oct',   long: 'October'},
      {short: 'Nov', med: 'Nov',   long: 'November'},
      {short: 'Dec', med: 'Dec',   long: 'December'}
    ]
  };
  
    var defaultState = function() {
        state = {
            current: 0,
            actions: {
                player: [],
                contact: [],
                hireling: []
            }
        };
        state.current = new Date().getMonth();
    };

    /*
        state.actions[1] = {
          player: [],
          contact: [],
          hireling: []
        };
        state.actions[2] = {
          player: [],
          contact: [],
          hireling: []
        };
        state.actions[3] = {
          player: [],
          contact: [],
          hireling: []
        };
        */

  defaultState();
  
  // --------------------------------------------------

  persist.registerLoad(function() {
    // Temporary details
    state = persist.doLoad('sin.fact.actions', state);
  });

  persist.registerSave(function() {
    // Temporary details
    persist.doSave('sin.fact.actions', state);
  });
  
  persist.registerWipe(function() {
    defaultState();
  });

  // --------------------------------------------------

  factory.getCurrentMonth = function() {
    return state.current;
  };

    factory.getCurrentMonthName = function(type, offset) {
        if (type === undefined)
            type = 'short';
        if (offset === undefined)
            offset = 0;

        // Offset is holder over from multi-month functions
        // Leaving this in since it doesn't actually affect anything if omitted and might be useful in the futre
        return factory.data.months[(state.current + offset)%12][type];
    };
  
  factory.setCurrentMonth = function(change) {
    if ((change < 0) || (change > 11)) {
      return false;
    }
    state.current = change;
    return true;
  };
  
  // --------------------------------------------------

  factory.hasFilterAction = function(filter, type) {
    for (var slot in state.actions[filter]) {
      if (state.actions[filter][slot].action == type) {
        return slot;
      }
    }
    return false;
  };

  // --------------------------------------------------

  factory.getFilterActions = function(filter) {
    return state.actions[filter];
  };
  
  factory.getActions = function() {
    return state.actions.player
      .concat(state.actions.contact)
      .concat(state.actions.hireling);
  };
  
  factory.addAction = function(filter, action) {
    action.filter = filter;
    state.actions[filter].push(action);
  };
  
  factory.removeActionNum = function(filter, num) {
    state.actions[filter].splice(num, 1);
  };

    // --------------------------------------------------

    // TODO this fixes the issue...
    // BUT.. the underlying cause is still unknown
    // Why is the selected state disappearing?

    // TODO: has multi-month removal fixed this?
    factory.getFilterCount = function(filter) {
        return state.actions[filter].length;
    };

    // --------------------------------------------------

    return factory;
});
