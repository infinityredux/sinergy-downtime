// Code goes here

mod = angular.module('sin.dtime.skills', [
    'sin.fact.skills',
    'sin.lib.persist',
]);

mod.directive('dtSkills', function() {
  return {
    restrict: 'E',
    scope: {
      dtime: '=',
    },
    templateUrl: 'fragments/dtime-skills.html',
  };
});

mod.directive('dtRankSelect', function() {
  return {
    restrict: 'E',
    scope: {
      skill: '=',
      disabled: '=',
    },
    controller: 'SkillController',
    controllerAs: 'sk',
    template: ''+
      '<select '+
        'ng-model="skillTree[skill].rank" '+
        'ng-options="opt.val as opt.desc for opt in sk.data.skill_opt" '+
        'class="sel-sizematch" '+
        'ng-disabled="disabled" '+
        'ng-change="skillTree[skill].slots=0" '+
      '></select>',
    link: function(scope, elem, attrs) {
      if(!attrs.disabled)
        attrs.disabled = 'false';
    },
  };
});

mod.directive('dtSkillSelect', function() {
  return {
    restrict: 'E',
    scope: {
      bindFilter: '&filter',
      bindRank: '=rank',
      bindSkill: '=skill',
    },
    controller: function($scope, skills) {
      $scope.skills = skills;
      $scope.skillTree = skills.getSkillTree();
    },
    controllerAs: 'sk',
    template: ''+
      '<span '+
        'ng-show="bindFilter().length>0" >'+
      '<select '+
        'ng-model="bindSkill" '+
        'ng-options="skill as skillTree[skill].name group by skillTree[skill].type for skill in bindFilter()" '+
        'ng-change="changed()" '+
      '>'+
      '<option value="" >--- select skill ---</option>'+
      '</select>'+
      '<input '+
        'type="hidden" '+
        'ng-model="bindRank" '+
      '>'+
      '<span ng-show="showRank" >'+
      '{{ (bindSkill ? " Rank " : "") + skillTree[bindSkill].rank }}'+
      '</span>'+
      '</span>'+
      '<span '+
        'ng-hide="bindFilter().length>0" >'+
      'No skills available'+
      '</span>',
    link: function(scope, elem, attrs) {
      if (attrs.rank)
        scope.showRank = true;
      else
        scope.showRank = false;
      
      scope.changed = function() {
        if(!scope.bindSkill) {
          scope.bindRank = 0;
          return;
        }
        scope.bindRank = scope.skillTree[scope.bindSkill].rank;
      };
    },
  };
});

mod.directive('dtSpecSelect', function() {
  return {
    restrict: 'E',
    scope: {
      bindFilter: '&filter',
      bindRank: '=rank',
      bindSpec: '=spec',
      bindSkill: '=skill'
    },
    controller: function($scope, skills) {
      $scope.skills = skills;
      $scope.skillTree = skills.getSkillTree();
    },
    controllerAs: 'sk',
    template: ''+
      '<span '+
        'ng-show="skills.treeFilterTrained().length>0" >'+
      '<select '+
        'ng-model="bindSpec" '+
        'ng-options="spec as skillTree[bindSkill].specs[spec].name for spec in skills.treeFilterSpecTrained(bindSkill)" '+
        'ng-change="changed()" '+
      '>'+
      '<option value="" >--- no spec ---</option>'+
      '</select>'+
      '<input '+
        'type="hidden" '+
        'ng-model="bindRank" '+
      '>'+
      '<span ng-show="showRank" >'+
      '{{ (bindSpec ? " +" : "") + skillTree[bindSkill].specs[bindSpec].rank }}'+
      '</span>'+
      '</span>'+
      '<span '+
        'ng-hide="skills.treeFilterTrained().length>0" >'+
      'No specs available'+
      '</span>',
    link: function(scope, elem, attrs) {
      if (attrs.rank)
        scope.showRank = true;
      else
        scope.showRank = false;
      
      scope.changed = function() {
        if(!scope.bindSpec) {
          scope.bindRank = 0;
          return;
        }
        scope.bindRank = scope.skillTree[scope.bindSkill].specs[scope.bindSpec].rank;
      };
    },
  };
});

mod.controller('SkillController', function($scope, persist, skills) {
  var ctrl = this;
  $scope.skills = skills;
  $scope.skillTree = skills.getSkillTree();
  
  ctrl.data = {
    skill_opt: {
      0: { val: 0, desc: "0" },
      1: { val: 1, desc: "1" },
      2: { val: 2, desc: "2" },
      3: { val: 3, desc: "3" },
      4: { val: 4, desc: "4" },
      5: { val: 5, desc: "5" },
    },
    spec_opt: {
      0: { val: 0, desc: "+0" },
      1: { val: 1, desc: "+1" },
      2: { val: 2, desc: "+2" },
      3: { val: 3, desc: "+3" },
    },
  };
  ctrl.state = {};
  
  var defaultState = function() {
    ctrl.state.lock_skill_edit = true;
    ctrl.state.select_new = "";
  };
  
  defaultState();
  
  ctrl.skill_select = "";
  
  ctrl.addClick = function() {
    if (ctrl.state.select_new === null) return;
    skills.treeAddSkill(ctrl.state.select_new);
  };

  ctrl.addSpecClick = function(skill, spec) {
    if (skill === null) return;
    if (spec === null) return;
    skills.treeAddSpec(skill, spec);
  };
  
  ctrl.removeClick = function(skill) {
    if (skill === null) return;
    skills.treeRemoveSkill(skill);
  };
  
  ctrl.removeSpecClick = function(skill, spec) {
    if (skill === null) return;
    if (spec === null) return;
    skills.treeRemoveSpec(skill, spec);
  };
  
});
