// Code goes here

mod = angular.module('sin.dtime.actions', [
  'sin.dtime.skills',
  'sin.ext.util',
  'sin.fact.actions',
  'sin.fact.assets',
  'sin.fact.money',
  'sin.fact.persist',
  'sin.fact.skills',
  ]);

mod.directive('dtActions', function() {
  return {
    restrict: 'E',
    scope: {
      dtime: '=',
    },
    templateUrl: 'fragments/dtime-actions.html',
  };
});

/*
mod.directive('integer', function(){
    return {
        require: 'ngModel',
        link: function(scope, ele, attr, ctrl){
            ctrl.$parsers.unshift(function(viewValue){
                return parseInt(viewValue, 10);
            });
        }
    };
});
*/

mod.directive('dtActionSlot', function(actions, assets, money, skills) {
  return {
    restrict: 'E',
    scope: true,
    bindToController: {
      slot: '=',
      num: '=',
      ctrl: '=',
    },
    templateUrl: 'dtime-actions-slot.html',
    controller: function($scope) {
      $scope.skills = skills;
      this.disableJobEdit = (assets.getJob().level>0);
      
      this.getLegend = function() {
        if (this.slot.filter === "player") {
          return "Slot " + (this.num + 1) + " - " + this.slot.desc + ":";
        }
        else if (this.slot.filter === "contact") {
          return this.slot.desc +" (" + "insert contact name here" + "):";
        }
        else {
          return this.slot.desc +" (hired help):";
        }
      };

      this.getSkillName = function() {
        if (this.slot.spec) {
          return (skills.treeSkillName(this.slot.skill) + '/' + 
            skills.treeSpecName(this.slot.skill,this.slot.spec));
        }
        //Otherwise
        return skills.treeSkillName(this.slot.skill);
      };

      this.getTotalSkill = function() {
        if (this.slot.filter == 'player') {
          var plusses = (this.slot.ranks_spec ? this.slot.ranks_spec : 0)
          + (this.slot.bonus_skill ? this.slot.bonus_skill : 0)
          + (this.slot.bonus_spec ? this.slot.bonus_spec : 0);
    
          if (plusses > 4) {
            plusses = Math.floor((plusses - 4) / 2) + 4;
          }
        
          return this.slot.ranks_skill + plusses;
        }
        
        //TODO: implement non-player stuff
        return 0;
      };
      
      this.calcSalary = function() {
        if (isNaN(parseInt(this.slot.level))) return 0;
        if (isNaN(this.getTotalSkill())) return 0;
        return assets.calcSalary(parseInt(this.slot.level), this.getTotalSkill());
      };
      
      this.updateJob = function() {
        if (isNaN(parseInt(this.slot.level))) return;
        if (isNaN(this.getTotalSkill())) return;

        var job = assets.getJob();
        job.employer = this.slot.employer;
        job.skill = this.slot.skill;
        job.spec = this.slot.spec;
        job.ranks = this.getTotalSkill();
        job.level = parseInt(this.slot.level);
        
        this.slot.money = this.calcSalary();
        money.changeMoney(this.slot.keyMoney, this.slot.money);

        this.disableJobEdit = true;
      };
      
      this.removeClick = function() {
        if (confirm("This will remove the action. Are you sure?")) {
          if (this.slot.keyMoney) {
            money.removeMoney(this.slot.keyMoney);
          }
          actions.removeActionNum(this.slot.filter, this.num);
          this.ctrl.externalChange();
        }
      };

      if (this.disableJobEdit && (this.slot.action == 'emp' || this.slot.action == 'over')) {
        var job = assets.getJob();
        this.slot.employer = job.employer;
        this.slot.skill = job.skill;
        this.slot.spec = job.spec;
        this.slot.ranks_skill = skills.treeSkillRank(job.skill);
        this.slot.ranks_spec = skills.treeSpecRank(job.skill, job.spec);
        this.slot.level = job.level;
        if (this.slot.action == 'emp')
          this.slot.money = this.calcSalary();
        else
          this.slot.money = this.calcSalary()/2;
        money.changeMoney(this.slot.keyMoney, this.slot.money);
      }
      
    },
    controllerAs: 'actSlot',
  };
});

mod.controller('ActionController', function($scope, actions, assets, money, persist, skills) {
  var ctrl = this;
  // Necessary for the ng-repeat(s) to work
  $scope.actions = actions;
  $scope.skills = skills;

  //Temporary for debug purpose
  $scope.assetJob = assets.getJob();
  
  ctrl.state = {};
  ctrl.data = {
    options: {
      do:   { val: 'do',   disable: false, desc: 'Do stuff', help: 'Actions and general skill training. Use this for any slot that doesn\'t match one of the other categories.'},
      make: { val: 'make', disable: false, desc: 'Make stuff', help: 'Generate AP, normally for a construction project of some variety.'}, 
      buy:  { val: 'buy',  disable: false, desc: 'Source / buy stuff', help: 'Spend a slot for the purpose of using CorpDeal or StreetDeal to purchase items with an AV above 0.'}, 
      net:  { val: 'net',  disable: false, desc: 'Netrun for exploits', help: 'Find exploits in systems that can be used immediately or in the next session.'}, 
      doc:  { val: 'doc',  disable: false, desc: 'Surgery', help: 'Have cyberware or bioware installed, removed or repaired.'}, 
      care: { val: 'care', disable: true,  desc: 'Aftercare', help: 'Required if the surgeon does not have enough skill to meet the AP required for surgery.'}, 
      emp:  { val: 'emp',  disable: false, desc: 'Employment', help: 'Earning money to pay bills the conventional (legal) way.'}, 
      over: { val: 'over', disable: true,  desc: 'Overtime', help: 'Spending extra time at work for more money; to train a skill select "Do stuff" instead.'},
    },
    option_skill: {
      player: {
        0: { val: 0, desc: "" },
        1: { val: 1, desc: "1" },
        2: { val: 2, desc: "2" },
        3: { val: 3, desc: "3" },
        4: { val: 4, desc: "4" },
        5: { val: 5, desc: "5" },
      },
      contact: {
        0: { val: 0, desc: "" },
        3: { val: 3, desc: "3/+1" },
        5: { val: 5, desc: "5/+2" },
      },
      hireling: {
        0: { val: 0, desc: "" },
        3: { val: 3, desc: "3/0" },
        5: { val: 5, desc: "5/0" },
      },
      spec: {
        0: { val: 0, desc: "" },
        1: { val: 1, desc: "+1" },
        2: { val: 2, desc: "+2" },
        3: { val: 3, desc: "+3" },
      },
    },
  };

  //Load from external save?
  //Also need to find a way to load / save employment skill
  //ctrl.state.employ=0;

  var isOptionDisabled = function(opt) {
    if (ctrl.state.person == 'player') {
      switch (opt) {
        case 'doc':
          return actions.hasFilterAction('player', 'doc');
        case 'care':
          return !actions.hasFilterAction('player', 'doc') || actions.hasFilterAction('player', 'care');
        case 'emp':
          return actions.hasFilterAction('player', 'emp');
        case 'over':
          return !actions.hasFilterAction('player', 'emp') || actions.hasFilterAction('player', 'over');
        default:
          return false;
      }
    }
    else {
      switch (opt) {
        case 'doc':
        case 'care':
        case 'emp':
        case 'over':
          return true;
        default:
          return false;
      }
    }
    return false;
  };

  var updateOptions = function() {
    ctrl.state.option_disable.do   = isOptionDisabled('do');
    ctrl.state.option_disable.make = isOptionDisabled('make');
    ctrl.state.option_disable.buy  = isOptionDisabled('buy');
    ctrl.state.option_disable.net  = isOptionDisabled('net');
    ctrl.state.option_disable.doc  = isOptionDisabled('doc');
    ctrl.state.option_disable.care = isOptionDisabled('care');
    ctrl.state.option_disable.emp  = isOptionDisabled('emp');
    ctrl.state.option_disable.over = isOptionDisabled('over');
  };
  
  //Initialise or reset everything else
  var defaultState = function() {
    ctrl.state.skill = "";
    ctrl.state.spec = "";

    ctrl.state.add = "";
    ctrl.state.skill = "";
    ctrl.state.spec = "";

    if (actions.getFilterCount('player') < 4) {
      ctrl.state.person = "player";
    }
    else {
      ctrl.state.person = "hireling";
    }

    //Temp saving for Netrunning overwrite
    //ctrl.state.saved = [];

    ctrl.state.ranks_skill=0;
    ctrl.state.bonus_skill=0;
    ctrl.state.ranks_spec=0;
    ctrl.state.bonus_spec=0;
    
    ctrl.state.option_disable = {};
    ctrl.state.month_tab="month1";
    
    ctrl.state.disableJobEdit = (assets.getJob().level>0);
    
    updateOptions();
  };
  
  defaultState();
  
  persist.registerLoad(function() {
    ctrl.state = persist.doLoad('sin.dtime.actions:state', ctrl.state);
    updateOptions();
  });

  persist.registerSave(function() {
    persist.doSave('sin.dtime.actions:state', ctrl.state);
  });

  persist.registerWipe(function() {
    defaultState();
  });
  /*
  ctrl.optChange = function() {
    if (ctrl.state.add == 'net') {
      ctrl.state.saved.push(ctrl.skill);
      ctrl.state.saved.push(ctrl.spec);
      ctrl.state.skill = "Netrunning";
      ctrl.state.spec = "System exploits";
    }
    else if (ctrl.state.saved.length > 0) {
      ctrl.spec = ctrl.saved.pop();
      ctrl.skill = ctrl.saved.pop();
    }
  };
  */
  ctrl.personChange = function() {
    ctrl.state.skill = 0;
    updateOptions();
  };
  
  ctrl.externalChange = function() {
    updateOptions();
  };
  
  ctrl.monthPaneChange = function(change) {
    actions.setSelectedMonth(change);
    ctrl.state.month_tab = 'month' + change;
    updateOptions();
  };
  
  ctrl.addClick = function() {
    var pushed = {
      action: ctrl.state.add,
      desc: ctrl.data.options[ctrl.state.add].desc,
    };
    
    //if (ctrl.state.skill)       pushed.skill        = ctrl.state.skill;
    //if (ctrl.state.spec)        pushed.spec         = ctrl.state.spec;
    //if (ctrl.state.ranks_skill) pushed.ranks_skill  = parseInt(ctrl.state.ranks_skill);
    //if (ctrl.state.ranks_spec)  pushed.ranks_spec   = parseInt(ctrl.state.ranks_spec);
    //if (ctrl.state.bonus_skill) pushed.bonus_skill  = parseInt(ctrl.state.bonus_skill);
    //if (ctrl.state.bonus_spec)  pushed.bonus_spec   = parseInt(ctrl.state.bonus_spec);
    
    /*
    var plusses = (pushed.ranks_spec ? pushed.ranks_spec : 0)
      + (pushed.bonus_skill ? pushed.bonus_skill : 0)
      + (pushed.bonus_spec ? pushed.bonus_spec : 0);
    
    if (plusses > 4) {
      plusses = Math.floor((plusses - 4) / 2) + 4;
    }*/
    
    //pushed.final_skill = (pushed.ranks_skill ? pushed.ranks_skill : 0) + plusses;
    
    if (ctrl.state.person == 'player') {
      if (ctrl.state.add == 'doc') {
      }
      if (ctrl.state.add == 'care') {
      }
      if (ctrl.state.add == 'emp') {
        //pushed.employ   = parseInt(ctrl.state.employ);
        //pushed.money    = pushed.employ * (pushed.final_skill + 1) * 50;
        pushed.keyMoney = money.addMoney(0, "Employment");
      }
      if (ctrl.state.add == 'over') {
        pushed.keyMoney = money.addMoney(0, "Overtime");
      }
    }
    else if (ctrl.state.person == 'hireling') {
      pushed.keyMoney = money.addMoney(-650, 'Hiring assistance in ' + ctrl.state.skill);
    } else {
      // Do nothing anymore?
    }
    
    actions.addAction(ctrl.state.person, pushed);

    // When saved
    defaultState();
  };
  
});
