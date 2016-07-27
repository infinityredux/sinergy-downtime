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
       months: 1,
       current: 0,
       selected: 0,
       actions: []
    };
    state.actions[0] = {
      player: [],
      contact: [],
      hireling: []
    };
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
    state.current = new Date().getMonth();
  };
  
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

  factory.getMonths = function() {
    return state.months;
  };
  
  factory.setMonths = function(change) {
    if ((change < 1) || (change > 4)) {
      return false;
    }
    state.months = change;
    factory.months = change;
    return true;
  };
  
  factory.getCurrentMonth = function() {
    return state.current;
  };
  
  factory.getCurrentMonthName = function(type, offset) {
    if (type === undefined)
      type = 'short';
    if (offset === undefined) 
      offset = 0;
    
    //alert(state.current + ' / ' + offset + ' / ' + (state.current + offset)%12);
    
    return factory.data.months[(state.current + offset)%12][type];
  };
  
  factory.setCurrentMonth = function(change) {
    if ((change < 0) || (change > 11)) {
      return false;
    }
    state.current = change;
    return true;
  };
  
  factory.getSelectedMonth = function() {
    return state.selected + 1;
  };
  
  factory.setSelectedMonth = function(change) {
    if ((change < 1) || (change > state.months)) {
      return false;
    }
    state.selected = change - 1;
    return true;
  };
  
  // --------------------------------------------------

  factory.hasFilterAction = function(filter, type) {
    for (var slot in state.actions[state.selected][filter]) {
      if (state.actions[state.selected][filter][slot].action == type) {
        return slot;
      }
    }
    return false;
  };

  // --------------------------------------------------

  factory.getFilterActions = function(filter) {
    return state.actions[state.selected][filter];
  };
  
  factory.getActions = function() {
    return state.actions[state.selected].player
      .concat(state.actions[state.selected].contact)
      .concat(state.actions[state.selected].hireling);
  };
  
  factory.addAction = function(filter, action) {
    action.filter = filter;
    state.actions[state.selected][filter].push(action);
  };
  
  factory.removeActionNum = function(filter, num) {
    state.actions[state.selected][filter].splice(num, 1);
  };

  // --------------------------------------------------

  // TODO this fixes the issue...
  // BUT.. the underlying cause is still unknown
  // Why is the selected state disappearing?
  factory.getFilterCount = function(filter) {
    if (state.selected === undefined)
      state.selected = 0;
    
    return state.actions[state.selected][filter].length;
  };

  // --------------------------------------------------

  return factory;
});
