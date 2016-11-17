mod = angular.module('sin.lib.storage', []);

mod.factory('storage', function() {
    var factory = {};
    var uids = {};

    // --------------------------------------------------

    factory.retrieveStorage = retrieveStorage;

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

    function createUID(type, val, parent) {
        if (parent !== undefined) {
            if (!isUID(parent)) {
                console.error("Attempt to create UID with invalid parent: " + parent);
                return undefined;
            }
        }

        // Random 4 character block of letters A to Z and numbers 0 to 9
        function keyBlock() { return Math.floor(Math.random()*1679616).toString(36); }
        var id;

        // Construct 16 character id, and make certain we haven't randomly created something that already exists
        do      { id = keyBlock() + keyBlock() + keyBlock() + keyBlock() }
        while   ( uids.hasOwnProperty(id) );

        uids[id] = {
            type:   type,
            data:   val,
            parent: parent
        };

        return id;
    }

    function readUID(id) {
        if (!isUID(id))
            return undefined;
        return uids[id].data;
    }

    function updateUID(id, val) {
        if (!isUID(id))
            return false;
        uids[id].data = val;
        return true;
    }

    function deleteUID(key) {
        if (!isUID(key))
            return false;
        delete uids[key];
        return true;
    }

    // --------------------------------------------------
    // --------------------------------------------------
    // --------------------------------------------------

});