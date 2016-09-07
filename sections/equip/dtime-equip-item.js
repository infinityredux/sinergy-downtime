mod = angular.module('sin.dtime.equip-item', [
    'sin.dtime.equip',
    'sin.fact.equip',
    'sin.lib.fieldset'
]);

mod.directive('dtEquipItem', function() {
    return {
        restrict: 'E',
        scope: {
            item: '='
        },
        controller: EquipItemController,
        controllerAs: 'ctrl',
        templateUrl: 'sections/equip/template-equip-item.html'
    }
});

function EquipItemController($scope, equip) {
    $scope.equip = equip;
}