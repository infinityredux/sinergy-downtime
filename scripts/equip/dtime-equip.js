// Code goes here

mod = angular.module('sin.dtime.equip', [
  'sin.ext.util',
  'sin.fact.assets',
  'sin.fact.equip',
  'sin.fact.lifestyle',
  'sin.fact.skills',
  'sin.fact.persist',
  ]);

mod.directive('dtEquip', function() {
  return {
    restrict: 'E',
    scope: {
      dtime: '=',
    },
    templateUrl: 'fragments/dtime-equip.html',
  };
});

mod.controller('EquipController', function($scope, assets, equip, lifestyle, skills, persist) {
  var ctrl = this;
  $scope.equip = equip;
  $scope.skills = skills;
  $scope.assetJob = assets.getJob();
  
  ctrl.state = {};
  ctrl.data = {
    types: {
      item:     {val: "item", desc: "Item", help:"A piece of equipment that doesn't fit in the other types. This includes guns, armour, tools, etc."},
      cyber:    {val: "cyber", desc: "Cyberware", help:"An item of cyberware installed in one or more locations (slots) in the human body."},
      bio:      {val: "bio", desc: "Bioware", help:"An item of bioware installed anywhere in the body."},
      deck:     {val: "deck", desc: "Cyberdeck", help:"Any variety of cyberdeck or server.  For a cyberware deck you will need to add the item in both this section and cyberware."},
      software: {val: "software", desc: "Software", help: "Software that runs on a cyberdeck."},
      contact:  {val: "contact", desc: "Contact", help: "A contact or friend that can assist you in downtime"},
    },
  };
  
  var defaultState = function() {
    ctrl.state.type = '';
  };
  
  defaultState();
  
  persist.registerLoad(function() {
    ctrl.state = persist.doLoad('sin.dtime.equip:state', ctrl.state);
  });

  persist.registerSave(function() {
    persist.doSave('sin.dtime.equip:state', ctrl.state);
  });

  persist.registerWipe(function() {
    defaultState();
  });

  ctrl.optChange = function () {
    
  };
  
  ctrl.newClick = function() {
    if (ctrl.state.type === '')
      return false;
      
    var item = {};
    item.name = 'Test item';
    item.type = ctrl.state.type;
    
    var details = {};
    
    equip.addEquip(item, details);
  };
});
