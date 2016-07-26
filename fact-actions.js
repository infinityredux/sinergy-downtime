// Code goes here

mod = angular.module('sin.fact.actions', ['sin.fact.persist']);

mod.factory('actions', function(persist) {
  var serv = {};
  var state = {};
  
  serv.data = {
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
      {short: 'Dec', med: 'Dec',   long: 'December'},
    ],
  };
  
  var defaultState = function() {
    state = {
       months: 1,
       current: 0,
       selected: 0,
       actions: [],
    };
    state.actions[0] = {
      player: [],
      contact: [],
      hireling: [],
    };
    state.actions[1] = {
      player: [],
      contact: [],
      hireling: [],
    };
    state.actions[2] = {
      player: [],
      contact: [],
      hireling: [],
    };
    state.actions[3] = {
      player: [],
      contact: [],
      hireling: [],
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

  serv.getMonths = function() {
    return state.months;
  };
  
  serv.setMonths = function(change) {
    if ((change < 1) || (change > 4)) {
      return false;
    }
    state.months = change;
    serv.months = change;
    return true;
  };
  
  serv.getCurrentMonth = function() {
    return state.current;
  };
  
  serv.getCurrentMonthName = function(type, offset) {
    if (type === undefined)
      type = 'short';
    if (offset === undefined) 
      offset = 0;
    
    //alert(state.current + ' / ' + offset + ' / ' + (state.current + offset)%12);
    
    return serv.data.months[(state.current + offset)%12][type];
  };
  
  serv.setCurrentMonth = function(change) {
    if ((change < 0) || (change > 11)) {
      return false;
    }
    state.current = change;
    return true;
  };
  
  serv.getSelectedMonth = function() {
    return state.selected + 1;
  };
  
  serv.setSelectedMonth = function(change) {
    if ((change < 1) || (change > state.months)) {
      return false;
    }
    state.selected = change - 1;
    return true;
  };
  
  // --------------------------------------------------

  serv.hasFilterAction = function(filter, type) {
    for (var slot in state.actions[state.selected][filter]) {
      if (state.actions[state.selected][filter][slot].action == type) {
        return slot;
      }
    }
    return false;
  };

  // --------------------------------------------------

  serv.getFilterActions = function(filter) {
    return state.actions[state.selected][filter];
  };
  
  serv.getActions = function() {
    return state.actions[state.selected].player
      .concat(state.actions[state.selected].contact)
      .concat(state.actions[state.selected].hireling);
  };
  
  serv.addAction = function(filter, action) {
    action.filter = filter;
    state.actions[state.selected][filter].push(action);
  };
  
  serv.removeActionNum = function(filter, num) {
    state.actions[state.selected][filter].splice(num, 1);
  };

  // --------------------------------------------------

  // TODO this fixes the issue...
  // BUT.. the underlying cause is still unknown
  // Why is the selected state disappearing?
  serv.getFilterCount = function(filter) {
    if (state.selected === undefined)
      state.selected = 0;
    
    return state.actions[state.selected][filter].length;
  };

  // --------------------------------------------------

  return serv;
});
