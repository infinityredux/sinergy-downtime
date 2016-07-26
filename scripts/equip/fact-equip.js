// Code goes here

mod = angular.module('sin.fact.equip', ['sin.fact.persist']);

mod.factory('equip', function(persist) {
  var serv = {};

  var list = {};
  var details = {};

  var defaultState = function() {
    list = {};
    details = {
      item: {},
      cyber: {},
      bio: {},
      deck: {},
      software: {},
      contact: {},
    };
  };
  
  defaultState();
  
  // --------------------------------------------------

  persist.registerLoad(function() {
    list    = persist.doLoad('sin.fact.equip:list', list);
    details = persist.doLoad('sin.fact.equip:details', details);
  });

  persist.registerSave(function() {
    persist.doSave('sin.fact.equip:list', list);
    persist.doSave('sin.fact.equip:details', details);
  });
  
  persist.registerWipe(function() {
    defaultState();
  });

  // --------------------------------------------------
  
  serv.displayState = function(info) {
    if (info == 'details')
      return JSON.stringify(details);
    
    return JSON.stringify(list);
  };
  
  // --------------------------------------------------

  serv.addEquip = function(item, dets) {
    var key;
    do {
      key = Math.floor(Math.random()*16777215).toString(16);
    }
    while (key in list);
    
    if (item.type === undefined)
      item.type = type;
    if (!details.hasOwnProperty(item.type))
      item.type = 'item';

    dets.key = key;
    list[key] = item;
    details[item.type][key] = dets;
  };
  
  serv.removeEquip = function(key) {
    if (!(key in list))
      return null;
    
    var out = list[key];
    delete list[key];
    delete details[out.type][key];
    
    return out;
  };

  // Equipment amendment function is not required.
  // An item in the ng-repeat updating a property does
  // propagate to the object stored in the factory.

  // --------------------------------------------------

  serv.getEquipList = function() {
    return list;
  };

  serv.getEquipTypes = function() {
    return Object.keys(details);
  };
  
  serv.getEquipTypeDetails = function(type) {
    return details[type];
  };
  
  serv.getEquipKeyDetails = function(key) {
    return details[list[key].type][key];
  };
  
  // --------------------------------------------------
  
  serv.getEquipCount = function(type) {
    if (details[type] === undefined)
      return -1;
    
    return Object.keys(details[type]).length;
  };
  
  serv.getEquipTotal = function() {
    return Object.keys(list).length;
  };
  
  // --------------------------------------------------
  
  return serv;
});
