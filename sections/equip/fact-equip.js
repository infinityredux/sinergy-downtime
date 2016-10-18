mod = angular.module('sin.fact.equip', [
    'sin.lib.persist',
    'sin.lib.registry'
]);

mod.factory('equip', function(persist, registry) {
    var factory = {};
    var state = {};
    var changed = false;

    var bindings = {};
    var legality = {
        'U'  : 0,
        'M'  : 1,
        'LE' : 2,
        'Med': 4
    };

    function defaultState() {
        state.items = {};
    }

    defaultState();

    // --------------------------------------------------

    persist.registerLoad(function() {
        state = persist.doLoad('sin.fact.equip', state);
        createBindings();
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

    function addBinding(key) {



        var bind = {}


    }

    function removeBinding(key) {

    }

    function createBindings() {
        bindings = {};

        var keys = Object.keys(state.items);
        for (var i=0; i < keys.length; i++) {
            addBinding(keys[i]);
        }
    }

    // --------------------------------------------------

    Object.defineProperty(factory, 'list', {
        get: function () { return state.items; },
        enumerable: true
    });

    // --------------------------------------------------

    // TODO create bindings type system here
    // Integer legality isn't compatible with the selector, as normal

    factory.addEquip = function(type) {
        var equip = registry.generateKey('equip');
        var bonus = registry.generateKey('equip-bonus');

        var item = {};
        item.type = type;
        item.name = '';
        item.legality = 0;
        item.effects = {};
        item.effects[bonus] = {
            skill: 0,
            spec: 0
        };

        state.items[equip] = item;
        return equip;
    };

    factory.removeEquip = function(key) {
        if (Object.keys(state.items).indexOf(key) < 0)
            return false;

        delete state.items[key];
        return true;
    };

    // --------------------------------------------------

    factory.countEquip = function(type) {
        return Object.keys(state.items)
            .filter(function (key) { return state.items[key].type == type; })
            .length;
    };

    factory.countEquipTotal = function() {
        return Object.keys(state.items).length;
    };

    factory.legality = function(types) {
        if (types instanceof Array) {
            if (types.length < 1)
                return -1;
            var count = 0;
            for (var i=0; i < types.length; i++) {
                count += legality[types[i]];
            }
            return count;
        } else {
            if (legality.hasOwnProperty(types))
                return legality[types];
            return -1;
        }
    };

    factory.legalityText = function(number) {
        var result = '';
        var first = true;
        number = parseInt(number);

        if (number < 1)
            return 'U';

        if (number >= 4) {
            number -= 4;
            if (!first)
                result = '/' + result;
            result = 'Med' + result;
            first = false;
        }

        if (number >= 2) {
            number -= 2;
            if (!first)
                result = '/' + result;
            result = 'LE' + result;
            first = false;
        }

        if (number >= 1) {
            number -= 1;
            if (!first)
                result = '/' + result;
            result = 'M' + result;
            first = false;
        }

        return result;
    };

    // --------------------------------------------------

    return factory;
});
