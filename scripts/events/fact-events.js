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

    function doChange() {
        changed = true;
    }

    function resetChange() {
        changed = false;
    }

    function isChanged() {
        return changed;
    }

    // --------------------------------------------------

    persist.registerLoad(function() {
        state = persist.doLoad('sin.fact.events', state);
    });

    persist.registerSave(function() {
        persist.doSave('sin.fact.events', state);
        resetChange();
    });

    persist.registerWipe(function() {
        defaultState();
    });

    // --------------------------------------------------

    Object.defineProperty(factory, 'session', {
        get: function() {return state.session;},
        set: function(val) {
            state.session = val;
            doChange();
        },
        enumerable: true
    });

    Object.defineProperty(factory, 'minor', {
        get: function() {return state.minor;},
        set: function(val) {
            state.minor = val;
            doChange();
        },
        enumerable: true
    });

    return factory;
});
