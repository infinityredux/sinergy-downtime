/**
 * Created by kedom on 29/07/2016.
 */

mod = angular.module('sin.core', ['sin.lib.persist']);

mod.factory('dtime', function(persist) {
    var factory = {};
    var state = {};
    var changed;

    function defaultState() {
        state = {};
        changed = false;
    }

    defaultState();

    // --------------------------------------------------

    function isChanged() {
        return changed;
    }

    // --------------------------------------------------

    persist.registerLoad(function() {
        state = persist.doLoad('sin.core', state);
    });

    persist.registerSave(function() {
        persist.doSave('sin.core', state);
        changed = false;
    });

    persist.registerWipe(function() {
        defaultState();
    });

    persist.registerShortTerm(isChanged);
    persist.registerLongTerm(isChanged());

    // --------------------------------------------------

    /*
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
    */

    return factory;
});
