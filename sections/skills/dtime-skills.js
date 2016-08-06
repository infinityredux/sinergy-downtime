mod = angular.module('sin.dtime.skills', [
    'sin.dtime.skills-selectors',
    'sin.fact.skills'
]);

mod.component('dtSkills', {
    controller: SkillController,
    controllerAs: 'ctrl',
    templateUrl: 'sections/skills/template-skills.html'
});

function SkillController($scope, skills) {
    var ctrl = this;
    $scope.skills = skills;
    $scope.skillTree = skills.tree;
  
    ctrl.data = {
        descSkill: {
            0: { val: 0, desc: "0" },
            1: { val: 1, desc: "1" },
            2: { val: 2, desc: "2" },
            3: { val: 3, desc: "3" },
            4: { val: 4, desc: "4" },
            5: { val: 5, desc: "5" }
        },
        descSpec: {
            0: { val: 0, desc: "+0" },
            1: { val: 1, desc: "+1" },
            2: { val: 2, desc: "+2" },
            3: { val: 3, desc: "+3" }
        }
    };

    ctrl.addClick = function() {
        if (skills.newSelected === null) return;
        skills.addSkill(skills.newSelected);
    };

    ctrl.addSpecClick = function(skill, spec) {
        if (skill === null) return;
        if (spec === null) return;
        skills.addSpec(skill, spec);
    };

    ctrl.removeClick = function(skill) {
        if (skill === null) return;
        skills.removeSkill(skill);
    };

    ctrl.removeSpecClick = function(skill, spec) {
        if (skill === null) return;
        if (spec === null) return;
        skills.removeSpec(skill, spec);
    };
}
