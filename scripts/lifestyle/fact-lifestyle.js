// Code goes here

mod = angular.module('sin.fact.lifestyle', ['sin.lib.persist']);

mod.factory('lifestyle', function(persist) {
  var serv = {};
  var lifestyle = {};
  var types = {};
  
  // --------------------------------------------------

  persist.registerLoad(function() {
    // Temporary details
    lifestyle = JSON.parse(localStorage.lifestyle);
  });

  persist.registerSave(function() {
    // Temporary details
    localStorage.lifestyle = JSON.stringify(lifestyle);
  });
  
  persist.registerWipe(function() {
    lifestyle = {};
  });

  // --------------------------------------------------

  serv.addLifestyle = function(t, l, d) {
    var key;
    do {
      key = Math.floor(Math.random()*16777215).toString(16);
    }
    while (key in lifestyle);
    
    lifestyle[key] = {
      type: t,
      lifestyle: l,
      desc: d
    };
    
    if (!types.hasOwnProperty(t)) {
      types[t] = {};
    }
    types[t][key] = {
      key: key
    };
    
    return key;
  };

  serv.changeLifestyle = function(key, t, l, d) {
    if ((l === undefined) && (d === undefined)) { return false; }
    if (!(key in lifestyle)) { return false; }
    
    if ((t !== undefined) && (t !== null)) { 
      // The complicated bit
      types[t][key] = types[lifestyle[key].type][key];
      delete typestypes[lifestyle[key].type][key];
      
      lifestyle[key].type = t; 
    }
    if ((l !== undefined) && (l !== null)) { lifestyle[key].lifestyle = l; }
    if ((d !== undefined) && (d !== null)) { lifestyle[key].desc = d; }
    return true;
  };
  
  serv.removeLifestyle = function(key) {
    // Check that the key exists
    if (!(key in lifestyle)) {
      return null;
    }
    
    // Save and return the deleted data
    var out = lifestyle[key];
    delete lifestyle[key];
    return out;
  };
  
  serv.listLifestyle = function() {
    return JSON.stringify(lifestyle) + ' / ' + JSON.stringify(types);
  };

  return serv;
});
