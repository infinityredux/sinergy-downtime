mod = angular.module('sin.fact.events', ['sin.lib.persist']);

mod.factory('events', function(persist) {
    var factory = {};
    var state = {};
    var changed;

    function defaultState() {
        state = {
            session: '',
            minor: ''
        };
        changed = false;
    }

    defaultState();

    // --------------------------------------------------

    function isChanged() {
        return changed;
    }

    // --------------------------------------------------

    persist.registerLoad(function() {
        state = persist.doLoad('sin.fact.events', state);
    });

    persist.registerSave(function() {
        persist.doSave('sin.fact.events', state);
        changed = false;
    });

    persist.registerWipe(function() {
        defaultState();
    });

    persist.registerShortTerm(isChanged);

    // --------------------------------------------------

    Object.defineProperty(factory, 'session', {
        get: function() {return state.session;},
        set: function(val) {
            state.session = val;
            changed = true;
        },
        enumerable: true
    });

    Object.defineProperty(factory, 'minor', {
        get: function() {return state.minor;},
        set: function(val) {
            state.minor = val;
            changed = true;
        },
        enumerable: true
    });

    return factory;
});
