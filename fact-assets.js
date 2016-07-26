// Code goes here

mod = angular.module('sin.fact.assets', [
  'sin.fact.persist',
  'sin.fact.skills',
  ]);

mod.factory('assets', function(persist, skills) {
  var serv = {};

  var details = {};

  var defaultState = function() {
    details = {
      job: {
        employer: 'Default Employer',
        skill: 0,
        spec: 0,
        ranks: 0,
        level: 0,
      },
      finances: {
        onHand: 0,
        stored: 0,
        debt: 0,
      },
    };
  };
  
  defaultState();
  
  // --------------------------------------------------

  persist.registerLoad(function() {
    details = persist.doLoad('sin.fact.assets:details', details);
  });

  persist.registerSave(function() {
    persist.doSave('sin.fact.assets:details', details);
  });
  
  persist.registerWipe(function() {
    defaultState();
  });

  // --------------------------------------------------
  
  serv.getJob = function() {
    return details.job;
  };
  
  serv.getFinances = function() {
    return details.finances;
  };
  
  // --------------------------------------------------

  serv.calcSalary = function(level, ranks) {
    return (level + 1) * ranks * 50;
  };

  // --------------------------------------------------
  // --------------------------------------------------
  // --------------------------------------------------
  
  return serv;
});
