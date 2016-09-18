// Code goes here

mod = angular.module('sin.dtime.equip', [
  'sin.fact',
  'sin.fact.assets',
  'sin.fact.equip',
  'sin.fact.lifestyle',
  'sin.lib.fieldset'
  ]);

mod.component('dtEquip', {
    controller: EquipController,
    controllerAs: 'ctrl',
    templateUrl: 'sections/equip/template-equip.html'
});

function EquipController($scope, dtime, equip, lifestyle) {
    var ctrl = this;
    $scope.dtime = dtime;
    $scope.equip = equip;
    $scope.lifestyle = lifestyle;

    ctrl.data = {
        types: {
            item:     {val: "item", desc: "Item", help:"A piece of equipment that doesn't fit in the other types. This includes guns, armour, tools, etc."},
            cyber:    {val: "cyber", desc: "Cyberware", help:"An item of cyberware installed in one or more locations (slots) in the human body."},
            bio:      {val: "bio", desc: "Bioware", help:"An item of bioware installed anywhere in the body."},
            deck:     {val: "deck", desc: "Cyberdeck", help:"Any variety of cyberdeck or server.  For a cyberware deck you will need to add the item in both this section and cyberware."},
            software: {val: "software", desc: "Software", help: "Software that runs on a cyberdeck."},
            contact:  {val: "contact", desc: "Contact", help: "A contact or friend that can assist you in downtime"}
        }
    };

    ctrl.state = {};
    
    function defaultState() {
        ctrl.state.optType = '';
        ctrl.state.txtName = '';
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

        var details = {};

        equip.addEquip(item, details);
        defaultState();
    };

    ctrl.removeClick = function () {

    };
}
