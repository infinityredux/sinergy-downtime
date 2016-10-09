mod = angular.module('sin.fact.equip', [
    'sin.lib.persist',
    'sin.lib.registry'
]);

mod.factory('equip', function(persist, registry) {
    var factory = {};
    var state = {};
    var changed = false;

    function defaultState() {
        state.items = {};
    }

    defaultState();

    // --------------------------------------------------

    persist.registerLoad(function() {
        state = persist.doLoad('sin.fact.equip', state);
        changed = false;
    });
    persist.registerSave(function() {
        persist.doSave('sin.fact.equip', state);
        changed = false;
    });
    persist.registerWipe(function() {
        defaultState();
        changed = false;
    });

    // --------------------------------------------------

    factory.addEquip = function(item) {
        var key = registry.generateKey('equip', item);
        state.items[key] = item;

        return key;
    };

    factory.removeEquip = function(key) {
        if (Object.keys(state.items).indexOf(key) < 0)
            return false;

        delete state.list[key];
        delete state.details[out.type][key];

        delete state.items[key];

        return true;
    };

    // --------------------------------------------------

    Object.defineProperty(factory, 'list', {
        get: function () { return state.items; },
        enumerable: true
    });

    // --------------------------------------------------

    factory.countEquip = function(type) {
        return Object.keys(state.items)
            .filter(function (key) { return state.items[key].type == type; })
            .length;
    };

    factory.countEquipTotal = function() {
        return Object.keys(state.items).length;
    };

    // --------------------------------------------------

    return factory;
});
