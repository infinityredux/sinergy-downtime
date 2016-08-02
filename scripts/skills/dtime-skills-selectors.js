mod = angular.module('sin.dtime.skills-selectors', [
    'sin.dtime.skills',
    'sin.fact.skills',
    'sin.lib.persist'
]);

mod.directive('dtRankSelect', function() {
    return {
        restrict: 'E',
        scope: {
            skill: '=',
            disabled: '='
        },
        controller: SkillController,
        controllerAs: 'ctrl',
        template: ''+
            '<select ng-model="skillTree[skill].rank" '+
            '        ng-options="opt.val as opt.desc for opt in ctrl.data.skill_opt" '+
            '        class="sel-sizematch" '+
            '        ng-disabled="disabled" '+
            '        ng-change="skillTree[skill].slots=0" >'+
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
            $scope.skillTree = skills.tree;
        },
        controllerAs: 'ctrl',
        template: ''+
            '<span ng-show="bindFilter().length>0" >'+
            '   <select ng-model="bindSkill" '+
            '           ng-options="skill as skillTree[skill].name group by skillTree[skill].type for skill in bindFilter()" '+
            '           ng-change="changed()" >'+
            '       <option value="" >--- select skill ---</option>'+
            '   </select>'+
            '   <input type="hidden" '+
            '          ng-model="bindRank" >'+
            '   <span ng-show="showRank" >'+
            '       {{ (bindSkill ? " Rank " : "") + skillTree[bindSkill].rank }}'+
            '   </span>'+
            '</span>'+
            '<span ng-hide="bindFilter().length>0" >'+
            '   No skills available'+
            '</span>',
        link: function(scope, elem, attrs) {
            scope.showRank = !!attrs.rank;
            scope.changed = function() {
                if(!scope.bindSkill) {
                    scope.bindRank = 0;
                    return;
                }
                scope.bindRank = scope.skillTree[scope.bindSkill].rank;
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
            $scope.skillTree = skills.tree;
        },
        controllerAs: 'ctrl',
        template: ''+
            '<span ng-show="skills.treeFilterTrained().length>0" >'+
            '   <select ng-model="bindSpec" '+
            '            ng-options="spec as skillTree[bindSkill].specs[spec].name for spec in skills.treeFilterSpecTrained(bindSkill)" '+
            '            ng-change="changed()" >'+
            '       <option value="" >--- no spec ---</option>'+
            '   </select>'+
            '   <input type="hidden" '+
            '          ng-model="bindRank" >'+
            '   <span ng-show="showRank" >'+
            '       {{ (bindSpec ? " +" : "") + skillTree[bindSkill].specs[bindSpec].rank }}'+
            '   </span>'+
            '</span>'+
            '<span ng-hide="skills.treeFilterTrained().length>0" >'+
            '   No specs available'+
            '</span>',
        link: function(scope, elem, attrs) {
            scope.showRank = !!attrs.rank;
            scope.changed = function() {
                if(!scope.bindSpec) {
                    scope.bindRank = 0;
                    return;
                }
                scope.bindRank = scope.skillTree[scope.bindSkill].specs[scope.bindSpec].rank;
            };
        }
    };
});
