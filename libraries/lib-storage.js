mod = angular.module('sin.lib.storage', []);

mod.factory('storage', function() {
    var factory = {};
    var uids = {};

    // --------------------------------------------------

    factory.retrieveStorage = retrieveStorage;

    // --------------------------------------------------

    function retrieveStorage(obj, schema) {
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
                localStorage[state] = createStorage(state);
            return localStorage[state];
        }

        throw new Error("unexpected parameter type '" + typeof obj + "' with value: " + obj);
    }


    function createStorage(state, schema) {
        var store = {};
        var config = {
            get: function(obj, prop) {
                if(schema.hasOwnProperty(prop)) {

                }
            },
            set: function(obj, prop, value) {

            }
        };

        var px = new Proxy(store, config);

        store.state = state;
        store.proxy = px;
        store.schema = schema;

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

        // Random character block of letters A to Z and numbers 0 to 9
        function keyBlock(len) { return Math.floor(Math.random()*Math.pow(36,len)).toString(36); }
        var id;

        // Construct an id with 16 randomised characters
        // Then make certain we haven't randomly created a UID that already exists
        do      { id = keyBlock(8) + '-' + keyBlock(8); }
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

    function setStringUID(id, val) {
        updateUID(id, ''+val);
    }

    function setNumberUID(id, val) {
        if (!isNumber(val)) {
            val = parseInt(val);
            if (isNaN(val))
                val = 0;
        }
        updateUID(id, val);
    }

    // --------------------------------------------------
    // --------------------------------------------------

});