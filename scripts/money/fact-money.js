// Code goes here

mod = angular.module('sin.fact.money', ['sin.lib.persist']);

mod.factory('money', function(persist) {
  var serv = {};
  var money = {};
  var start = 0;
  var final = 0;
  
  serv.start = 0;
  serv.final = 0;
  
  // --------------------------------------------------
  
  persist.registerLoad(function() {
    money = persist.doLoad('sin.fact.money:money', money);
    start = persist.doLoad('sin.fact.money:start', start);
  });

  persist.registerSave(function() {
    persist.doSave('sin.fact.money:money', money);
    persist.doSave('sin.fact.money:start', start);
  });

  persist.registerWipe(function() {
    money = {};
  });

  // --------------------------------------------------

  serv.addMoney = function(m, d) {
    var key;
    do {
      key = Math.floor(Math.random()*16777215).toString(16);
    }
    while (key in money);
    
    money[key] = {
      money: m,
      desc: d
    };
    
    serv.calcFinal();
    
    return key;
  };
  
  serv.changeMoney = function(key, m, d) {
    // Safety check that we actually have variables to change
    // And only change a key that already exists
    if ((m === undefined) && (d === undefined)) { return false; }
    if (!(key in money)) { return false; }
    
    // Do the work
    if ((m !== undefined) && (m !== null)) { money[key].money = m; }
    if ((d !== undefined) && (d !== null)) { money[key].desc = d; }
    serv.calcFinal();
    return true;
  };
  
  serv.removeMoney = function(key) {
    // Check that the key exists
    if (!(key in money)) {
      return null;
    }
    
    // Save and return the deleted data
    var out = money[key];
    delete money[key];
    serv.calcFinal();
    return out;
  };
  
  serv.listMoney = function() {
    return JSON.stringify(money);
  };
  
  serv.haveMoney = function() {
    return money.length > 0;
  };
  
  serv.getMoney = function() {
    return money;
  };
  
  // --------------------------------------------------

  serv.getStarting = function() {
    return start;
  };
  
  serv.setStarting = function(s) {
    start = s;
  };

  serv.calcFinal = function() {
    start = serv.start;
    final = serv.start;
    angular.forEach(money, function(val) {
      final += val.money;
    });
    serv.final = final;
  };
  
  serv.calcFinal();
  
  // --------------------------------------------------

  return serv;
});
