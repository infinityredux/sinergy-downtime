mod = angular.module('sin.dtime.equip-item', [
    'sin.dtime.equip',
    'sin.fact.equip',
    'sin.fact.skills',
    'sin.lib.fieldset'
]);

mod.directive('dtEquipItem', function() {
    return {
        restrict: 'E',
        scope: {
            id: '=',
            item: '='
        },
        controller: EquipItemController,
        controllerAs: 'ctrl',
        templateUrl: 'sections/equip/template-equip-item.html'
    }
});

function EquipItemController($scope, equip, skills) {
    var ctrl = this;
    $scope.equip = equip;
    $scope.skills = skills;

    ctrl.removeClick = function () {
        if (!equip.removeEquip($scope.id)) {
            console.error('EquipItemController: removing an item of id "' + $scope.id + '" failed.');
        }
    };

    ctrl.newEffectClick = function () {
        equip.addEquipEffect($scope.id);
    };

    ctrl.removeEffectClick = function(effect) {
        if (!equip.removeEquipEffect($scope.id, effect)) {
            console.error('EquipItemController: removing an item effect of ids "' + $scope.id + '" and "' + effect + '" failed.');
        }
    }
}