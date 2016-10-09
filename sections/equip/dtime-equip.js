// Code goes here

mod = angular.module('sin.dtime.equip', [
    'sin.fact',
    'sin.fact.assets',
    'sin.fact.equip',
    'sin.fact.skills',
    'sin.fact.lifestyle',
    'sin.lib.fieldset'
]);

mod.component('dtEquip', {
    controller: EquipController,
    controllerAs: 'ctrl',
    templateUrl: 'sections/equip/template-equip.html'
});

function EquipController($scope, dtime, equip, lifestyle, skills) {
    var ctrl = this;
    $scope.dtime = dtime;
    $scope.equip = equip;
    $scope.lifestyle = lifestyle;
    $scope.skills = skills;

    ctrl.data = {
        types: {
            item:     {val: "item", desc: "Item", help:"A piece of equipment that doesn't fit in the other types. This includes guns, armour, tools, etc."},
            cyber:    {val: "cyber", desc: "Cyberware", help:"An item of cyberware installed in one or more locations (slots) in the human body."},
            bio:      {val: "bio", desc: "Bioware", help:"An item of bioware installed anywhere in the body."},
            deck:     {val: "deck", desc: "Cyberdeck", help:"Any variety of cyberdeck or server.  For a cyberware deck you will need to add the item in both this section and cyberware."},
            software: {val: "software", desc: "Software", help: "Software that runs on a cyberdeck."}
        }
    };

    ctrl.state = {};

    function defaultState() {
        ctrl.state.optType = '';
        ctrl.state.txtName = '';
        ctrl.state.selSkill = 0;
        ctrl.state.selSpec = 0;
    }

    defaultState();

    ctrl.typeChange = function () {

    };

    ctrl.newClick = function() {
        if ( ctrl.state.optType === '')
            return false;

        var item = {};
        item.type = ctrl.state.optType;
        item.name = ctrl.state.txtName;
        item.skill = ctrl.state.selSkill;
        item.spec = ctrl.state.selSpec;

        var details = {};

        equip.addEquip(item, details);
        defaultState();
    };
}
