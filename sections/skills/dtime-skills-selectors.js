mod = angular.module('sin.dtime.skills-selectors', [
    'sin.dtime.skills',
    'sin.fact.skills'
]);

mod.directive('dtSkillRank', function() {
    return {
        restrict: 'E',
        scope: {
            skill: '=',
            disabled: '='
        },
        controller: SkillController,
        controllerAs: 'ctrl',
        template: ''+
            '<select ng-model="skills.bindings[skill].rank" '+
            '        ng-options="opt.val as opt.desc for opt in ctrl.data.descSkill" '+
            '        class="sel-sizematch" '+
            '        ng-disabled="disabled" '+
            '        ng-change="skills.bindings[skill].slots=0" >'+
            '</select>',
        link: function(scope, elem, attrs) {
            if(!attrs.disabled)
                attrs.disabled = 'false';
        }
    };
});

mod.directive('dtSpecRank', function() {
    return {
        restrict: 'E',
        scope: {
            spec: '=',
            disabled: '='
        },
        controller: SkillController,
        controllerAs: 'ctrl',
        template: ''+
        '<select ng-model="skills.bindings[spec].rank" '+
        '        ng-options="opt.val as opt.desc for opt in ctrl.data.descSpec" '+
        '        class="sel-sizematch" '+
        '        ng-disabled="disabled" '+
        '        ng-change="skills.bindings[spec].slots=0" >'+
        '</select>',
        link: function(scope, elem, attrs) {
            if(!attrs.disabled)
                attrs.disabled = 'false';
        }
    };
});

mod.directive('dtSkillSelect', function() {
    return {
        restrict: 'E',
        scope: {
            bindFilter: '&filter',
            bindRank: '=rank',
            bindSkill: '=skill'
        },
        controller: function($scope, skills) {
            $scope.skills = skills;
        },
        controllerAs: 'ctrl',
        templateUrl: 'sections/skills/template-select-skill.html',
        link: function(scope, elem, attrs) {
            scope.showRank = !!attrs.rank;
            scope.changed = function() {
                if(!scope.bindSkill) {
                    scope.bindRank = 0;
                    return;
                }
                scope.bindRank = scope.skills.bindings[scope.bindSkill].rank;
            };
        }
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
        },
        controllerAs: 'ctrl',
        templateUrl: 'sections/skills/template-select-spec.html',
        link: function(scope, elem, attrs) {
            scope.showRank = !!attrs.rank;
            scope.changed = function() {
                if(!scope.bindSpec) {
                    scope.bindRank = 0;
                    return;
                }
                scope.bindRank = scope.skills.bindings[scope.bindSpec].rank;
            };
        }
    };
});
