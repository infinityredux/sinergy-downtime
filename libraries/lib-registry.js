mod = angular.module('sin.lib.registry', []);

mod.factory('registry', function() {
    var factory = {};
    var register = {};
    var keys = [];

    factory.isRegistered = function (key) {
        return keys.indexOf(key) > -1;
    };

    factory.generateKey = function (type, store) {
        var id;

        do      { id = Math.floor(Math.random()*16777215).toString(16); }
        while   ( keys.indexOf(id) > -1 );

        keys.append(id);
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
