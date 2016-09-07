mod = angular.module('sin.fact.equip', [
    'sin.lib.persist',
    'sin.lib.registry'
]);

mod.factory('equip', function(persist, registry) {
    var factory = {};
    var state = {};

    function defaultState() {
        state.list = {};
        state.details = {
            item: {},
            cyber: {},
            bio: {},
            deck: {},
            software: {},
            contact: {}
        };

        state.optType = '';
        state.items = {};
    }

    defaultState();

    // --------------------------------------------------

    persist.registerLoad(function() {
        state = persist.doLoad('sin.fact.equip', state);
    });
    persist.registerSave(function() {
        persist.doSave('sin.fact.equip', state);
    });
    persist.registerWipe(function() {
        defaultState();
    });

    // --------------------------------------------------

    factory.displayState = function(info) {
        if (info == 'details')
            return JSON.stringify(state.details);

        return JSON.stringify(state.list);
    };

    // --------------------------------------------------

    factory.addEquip = function(item, dets) {
        var key = registry.generateKey('equip', item);

        if (item.type === undefined)
            item.type = state.optType;
        if (!state.details.hasOwnProperty(item.type))
            item.type = 'item';

        dets.key = key;
        state.list[key] = item;
        state.details[item.type][key] = dets;
    };

    factory.removeEquip = function(key) {
        if (!(key in state.list))
            return null;

        var out = state.list[key];
        delete state.list[key];
        delete state.details[out.type][key];

        return out;
    };

    // Equipment amendment function is not required.
    // An item in the ng-repeat updating a property does
    // propagate to the object stored in the factory.

    // --------------------------------------------------

    factory.getEquipList = function() {
        return state.list;
    };

    factory.getEquipTypes = function() {
        return Object.keys(state.details);
    };

    factory.getEquipTypeDetails = function(type) {
        return state.details[type];
    };

    factory.getEquipKeyDetails = function(key) {
        return state.details[state.list[key].type][key];
    };

    // --------------------------------------------------

    factory.getEquipCount = function(type) {
        if (state.details[type] === undefined)
            return -1;

        return Object.keys(state.details[type]).length;
    };

    factory.getEquipTotal = function() {
        return Object.keys(state.list).length;
    };

    // --------------------------------------------------

    return factory;
});
