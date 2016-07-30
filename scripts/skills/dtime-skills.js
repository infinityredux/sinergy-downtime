// Code goes here

mod = angular.module('sin.dtime.skills', [
    'sin.fact.skills',
    'sin.lib.persist'
]);

mod.component('dtSkills', {
    controller: SkillController,
    controllerAs: 'ctrl',
    templateUrl: 'fragments/skills.html'
});

function SkillController ($scope, persist, skills) {
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
      5: { val: 5, desc: "5" }
    },
    spec_opt: {
      0: { val: 0, desc: "+0" },
      1: { val: 1, desc: "+1" },
      2: { val: 2, desc: "+2" },
      3: { val: 3, desc: "+3" }
    }
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
  
}
