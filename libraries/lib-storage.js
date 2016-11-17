mod = angular.module('sin.lib.store', []);

mod.factory('store', function() {
    var factory = {};
    var uids = {};

    // --------------------------------------------------

    factory.getState = retrieveStorage;
    factory.getUI = retrieveStorage;

    // --------------------------------------------------

    function retrieveStorage(obj) {
        if (typeof(Storage) !== "undefined")
            throw new Error("localStorage is not available");

        var state = null;

        if (typeof obj == "string")     state = obj;
        if (typeof obj == "function")   state = obj();
        if (typeof obj == "object") {
            if (obj.hasOwnProperty("storageKey")) {
                if (typeof obj['storageKey'] == "function") {
                    state = obj['storageKey']();
                }
            }
        }

        if (state) {
            if (!localStorage.hasOwnProperty(state))
                localStorage[state] = createStore(state);
            return localStorage[state];
        }

        throw new Error("unexpected parameter type '" + typeof obj + "' with value: " + obj);
    }


    function createStore(state) {
        var store = {};
        store.state = state;

        return store;
    }

    // --------------------------------------------------

    function isUID(id) {
        return uids.hasOwnProperty(id);
    }

    function generateUID(type, data) {
        var id;

        // Random 4 character block of letters A to Z and numbers 0 to 9
        function keyBlock() { return Math.floor(Math.random()*1679616).toString(36); }

        // Construct 16 character id, and make certain we haven't randomly created something that already exists
        do      { id = keyBlock() + keyBlock() + keyBlock() + keyBlock() }
        while   ( uids.hasOwnProperty(id) );

        uids[id] = {
            type:   type,
            data:   data
        };

        return id;
    }

    function updateUID(id, data) {
        if (!isRegistered(id))
            return false;
        register[id].data = data;
        return true;
    }

    function removeUID(key) {
        if (!isRegistered(key))
            return false;
        delete uids[key];
        return true;
    }

    // --------------------------------------------------
    // --------------------------------------------------
    // --------------------------------------------------

});