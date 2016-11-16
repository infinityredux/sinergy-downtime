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

    function addItemBinding(item) {
        if (item === undefined)                 return false;
        if (state.items[item] === undefined)    return false;

        var bind = {};

        Object.defineProperty(bind, 'type', {
            get: function() { return state.items[item].type; },
            enumerable: true
        });

        Object.defineProperty(bind, 'name', {
            get: function() { return state.items[item].name; },
            set: function(val) {
                state.items[item].name = val;
                changed = true;
            },
            enumerable: true
        });

        Object.defineProperty(bind, 'legality', {
            get: function() { return '' + state.items[item].legality; },
            set: function(val) {
                state.items[item].legality = parseInt(val);
                if (isNaN(state.items[item].legality))
                    state.items[item].legality = 0;
                changed = true;
            },
            enumerable: true
        });

        bind.effects = {};
        bindings[item] = bind;

        var keys = Object.keys(state.items[item].effects);
        for (var i=0; i < keys.length; i++) {
            addEffectBinding(item, keys[i]);
        }

        return true;
    }
    
    function addEffectBinding(item, effect) {
        if (item === undefined)                                 return false;
        if (effect === undefined)                               return false;
        if (state.items[item] === undefined)                    return false;
        if (state.items[item].effects[effect] === undefined)    return false;

        var bind = {};

        Object.defineProperty(bind, 'skill', {
            get: function() { return '' + state.items[item].effects[keys[i]].skill; },
            set: function(val) {
                state.items[item].effects[keys[i]].skill = parseInt(val);
                if (isNaN(state.items[item].effects[keys[i]].skill))
                    state.items[item].effects[keys[i]].skill = 0;
                changed = true;
            },
            enumerable: true
        });

        Object.defineProperty(bind, 'spec', {
            get: function() { return '' + state.items[item].effects[keys[i]].spec; },
            set: function(val) {
                state.items[item].effects[keys[i]].spec = parseInt(val);
                if (isNaN(state.items[item].effects[keys[i]].spec))
                    state.items[item].effects[keys[i]].spec = 0;
                changed = true;
            },
            enumerable: true
        });

        Object.defineProperty(bind, 'base', {
            get: function() { return '' + state.items[item].effects[keys[i]].base; },
            set: function(val) {
                state.items[item].effects[keys[i]].base = parseInt(val);
                if (isNaN(state.items[item].effects[keys[i]].base))
                    state.items[item].effects[keys[i]].base = 0;
                changed = true;
            },
            enumerable: true
        });

        Object.defineProperty(bind, 'plus', {
            get: function() { return '' + state.items[item].effects[keys[i]].plus; },
            set: function(val) {
                state.items[item].effects[keys[i]].plus = parseInt(val);
                if (isNaN(state.items[item].effects[keys[i]].plus))
                    state.items[item].effects[keys[i]].plus = 0;
                changed = true;
            },
            enumerable: true
        });

        bindings[item].effects[effect] = bind;
        return true;
    }

    function removeItemBinding(item) {
        if (item === undefined)                 return false;
        if (bindings[item] === undefined)    return false;

        delete bindings[item];
        return true;
    }
    
    function removeEffectBinding(item, effect) {
        if (item === undefined)                                 return false;
        if (effect === undefined)                               return false;
        if (bindings[item] === undefined)                    return false;
        if (bindings[item].effects[effect] === undefined)    return false;

        delete bindings[item].effects[effect];
        return true;
    }

    function createBindings() {
        bindings = {};

        var keys = Object.keys(state.items);
        for (var i=0; i < keys.length; i++) {
            addItemBinding(keys[i]);
        }
    }

    // --------------------------------------------------

    Object.defineProperty(factory, 'list', {
        get: function () { return state.items; },
        enumerable: true
    });

    // --------------------------------------------------

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
            spec: 0,
            base: 0,
            plus: 0
        };

        state.items[equip] = item;
        addItemBinding(equip);
        return equip;
    };

    factory.removeEquip = function(equip) {
        if (Object.keys(state.items).indexOf(equip) < 0)
            return false;

        state.items[equip].effects.forEach(function(object, effect) {
            factory.removeEquipEffect(equip, effect);
        });

        removeItemBinding(equip);
        registry.removeKey(equip);
        delete state.items[equip];
        return true;
    };

    factory.addEquipEffect = function(equip) {
        var bonus = registry.generateKey('equip-bonus');
        state.items[equip].effects[bonus] = {
            skill: 0,
            spec: 0,
            base: 0,
            plus: 0
        };
        addEffectBinding(equip, bonus);
        return true
    };

    factory.removeEquipEffect = function(equip, effect) {
        if (Object.keys(state.items).indexOf(equip) < 0)
            return false;
        if (Object.keys(state.items[equip].effects).indexOf(effect) < 0)
            return false;

        removeEffectBinding(equip, effect);
        registry.removeKey(effect);
        delete state.items[equip].effects[effect];
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
            if (!first)
                result = '/' + result;
            result = 'M' + result;
        }

        return result;
    };

    // --------------------------------------------------

    return factory;
});
