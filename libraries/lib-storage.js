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

        var key = null;

        if (typeof obj == "string")     key = obj;
        if (typeof obj == "function")   key = obj();
        if (typeof obj == "object") {
            if (obj.hasOwnProperty("storageKey")) {
                if (typeof obj['storageKey'] == "function") {
                    key = obj['storageKey']();
                }
            }
        }

        if (key) {
            if (!localStorage.hasOwnProperty(key)) {
                localStorage[key] = createStorage(key, schema);
            }
            else {
                if (schema !== undefined)
                    updateStorageSchema(localStorage[key], schema);
            }
            return createProxy(localStorage[key]);
        }

        throw new Error("unexpected parameter type '" + typeof obj + "' with value: " + obj);
    }


    function createStorage(type, schema) {
        var store = {};

        store.type = type;
        store.map = {};
        store.schema = {};
        updateStorageSchema(store, schema);

        return store;
    }

    function updateStorageSchema(store, newSchema) {
        var map = {};

        Object.keys(store.schema).forEach(function(key) {
            if (newSchema.hasOwnProperty(key)) {
                // TODO add validation that this is the same data type
                // If not we need to overwrite with a default value
                // (and write a warning to the log with the old value?)
                map[key] = store.map[key];
            }
        });

        Object.keys(newSchema).forEach(function (key) {
            if (!store.schema.hasOwnProperty(key)) {
                var raw = '';
                // TODO insert sane default values here
                map[key] = createUID(store.type, raw);
            }
        });

        Object.keys(store.map).forEach(function (key) {
            if (!map.hasOwnProperty(key)) {
                deleteUID(store.map[key]);
                // TODO ? error handing here (in case delete returns false)?
            }
        });

        store.schema = newSchema;
        store.map = map;
    }

    function createProxy(store) {
        var config = {
            get: function(obj, prop) {
                if (!store.schema.hasOwnProperty(prop)) {
                    throw new InvalidPropertyException('Attempt to update "' + prop + '" on "' + store.type +
                        '" storage object. This property is not defined in the schema configuration.');
                }

                var id = store.map[prop];
                return readUID(id);
            },
            set: function(obj, prop, val) {
                if (!store.schema.hasOwnProperty(prop)) {
                    throw new InvalidPropertyException('Attempt to update "' + prop + '" on "' + store.type +
                        '" storage object. This property is not defined in the schema configuration.');
                }

                var id = store.map[prop];

                switch (store.schema[prop]) {
                    case 'string':
                        setStringUID(id, val);
                        // TODO error handling?
                        break;

                    case 'number':
                        setNumberUID(id, val);
                        // TODO error handling?
                        break;

                    default:
                        throw new SchemaException('Schema property "' + prop + '" on "' + store.type + '" storage ' +
                            'object of type "' + store.schema[prop] + '" is not understood.');
                }
            },
            deleteProperty: function() {

            },
            defineProperty: function() {

            }
        };

        // Relies of ES6 existing to work correctly
        // If if doesn't, can do a work around with Object.defineProperty in a loop through the schema properties
        // This would create a data binding object, but it would also lack the runtime flexibility of a true proxy
        return new Proxy(store, config);
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

    function deleteUID(id) {
        if (!isUID(id))
            return false;
        delete uids[id];
        return true;
    }

    // --------------------------------------------------

    function setStringUID(id, val) {
        return updateUID(id, ''+val);
    }

    function setNumberUID(id, val) {
        if (!isNumber(val)) {
            val = parseInt(val);
            if (isNaN(val))
                val = 0;
        }
        return updateUID(id, val);
    }

    // --------------------------------------------------
    // --------------------------------------------------

});

/**
 * Custom exception for Schema errors.
 * Used as an indication that the schema itself is in some way invalid or corrupt.
 *
 * @param message The message describing a specific cause of this exception.
 * @constructor
 */
function SchemaException(message) {
    this.message = message;
    this.name = "SchemaException";
}

/**
 * Make certain the exception outputs an appropriate message when used as a string (e.g. error console)
 * @returns {string} A combination of the exception name and message.
 */
SchemaException.prototype.toString = function() {
    return this.name + ": '" + this.message + "'";
};

/**
 * Custom exception for invalid property access.
 * Used as an indication that an attempt was made to access (read or update) a property that does not exist in the
 * current schema.
 *
 * @param message The message describing a specific cause of this exception.
 * @constructor
 */
function InvalidPropertyException(message) {
    this.message = message;
    this.name = "SchemaException";
}

/**
 * Make certain the exception outputs an appropriate message when used as a string (e.g. error console)
 * @returns {string} A combination of the exception name and message.
 */
InvalidPropertyException.prototype.toString = function() {
    return this.name + ": '" + this.message + "'";
};

/**
 *
 * @param message
 * @constructor
 */
function UpdateFailedException(message) {
    this.message = message;
    this.name = "SchemaException";
}

/**
 * Make certain the exception outputs an appropriate message when used as a string (e.g. error console)
 * @returns {string} A combination of the exception name and message.
 */
UpdateFailedException.prototype.toString = function() {
    return this.name + ": '" + this.message + "'";
};
