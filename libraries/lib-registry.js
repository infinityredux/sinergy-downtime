mod = angular.module('sin.lib.registry', ['sin.lib.persist']);

mod.factory('registry', function(persist) {
    var factory = {};
    var register;
    var keys;

    // --------------------------------------------------

    function defaultState() {
        register = {};
        keys = [];
    }

    defaultState();

    // --------------------------------------------------

    persist.registerLoad(function() {
        register    = persist.doLoad('sin.lib.register', register);
        keys        = Object.keys(register);
    });
    persist.registerSave(function() {
        persist.doSave('sin.lib.register', register);
    });
    persist.registerWipe(function() {
        defaultState();
    });

    // --------------------------------------------------

    factory.isRegistered = function (key) {
        return keys.indexOf(key) > -1;
    };

    factory.generateKey = function (type, store) {
        var id;

        do      { id = Math.floor(Math.random()*16777215).toString(16); }
        while   ( keys.indexOf(id) > -1 );

        keys.push(id);
        register[id] = {
            type:   type,
            data:   store
        };

        return id;
    };

    factory.updateKey = function(key, store) {
        if (!factory.isRegistered(key))
            return false;
        register[key].data = store;
        return true;
    };

    factory.removeKey = function(key) {
        if (!factory.isRegistered(key))
            return false;

        delete register[key];
        keys.splice(keys.indexOf(key),1);
        return true;
    };

    return factory;
});
