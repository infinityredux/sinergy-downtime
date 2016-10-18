// Code goes here

mod = angular.module('sin.dtime.equip', [
    'sin.fact',
    'sin.fact.assets',
    'sin.fact.equip',
    'sin.lib.fieldset'
]);

mod.component('dtEquip', {
    controller: EquipController,
    controllerAs: 'ctrl',
    templateUrl: 'sections/equip/template-equip.html'
});

function EquipController($scope, dtime, equip) {
    var ctrl = this;
    $scope.dtime = dtime;
    $scope.equip = equip;

    ctrl.data = {
        types: {
            item:     {val: "item", desc: "General Item", help:"A piece of equipment that doesn't fit in the other types. This includes guns, armour, tools, etc."},
            cyber:    {val: "cyber", desc: "Cyberware", help:"An item of cyberware installed in one or more locations (slots) in the human body."},
            bio:      {val: "bio", desc: "Bioware", help:"An item of bioware installed anywhere in the body."},
            deck:     {val: "deck", desc: "Cyberdeck", help:"Any variety of cyberdeck or server.  For a cyberware deck you will need to add the item in both this section and cyberware."},
            software: {val: "software", desc: "Software", help: "Software that runs on a cyberdeck."}
        }
    };

    ctrl.state = {};

    function defaultState() {
        ctrl.state.optType = '';
    }

    defaultState();

    ctrl.newClick = function() {
        if ( ctrl.state.optType === '')
            return false;

        equip.addEquip(ctrl.state.optType);
        defaultState();
    };
}
