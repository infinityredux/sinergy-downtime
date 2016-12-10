mod = angular.module('sin.lib.storage', []);

mod.factory('storage', function() {
    var factory = {};
    var proxies = {};

    // --------------------------------------------------

    factory.exportStorage = exportStorage;
    factory.importStorage = importStorage;
    factory.retrieveStorage = retrieveStorage;

    // --------------------------------------------------

    function retrieveStorage(obj, schema) {
        if (typeof(Storage) !== "undefined")
            throw new Error("localStorage is not available but is required for this library to work.");
        if (typeof(Proxy) !== "undefined")
            throw new Error("Proxy (ES6 feature) is not available but is required for this library to work.");
        if (!localStorage.hasOwnProperty('roots'))
            localStorage.roots = {};
        if (!localStorage.hasOwnProperty('uids'))
            localStorage.uids = {};

        var origin = null;

        if (typeof obj == "string")     origin = obj;
        if (typeof obj == "function")   origin = obj();
        if (typeof obj == "object") {
            if (obj.hasOwnProperty("storageKey")) {
                if (typeof obj['storageKey'] == "string") {
                    origin = obj['storageKey'];
                }
                if (typeof obj['storageKey'] == "function") {
                    origin = obj['storageKey']();
                }
            }
        }

        if (origin) {
            if (!localStorage.roots.hasOwnProperty(origin)) {
                localStorage.roots[origin] = createStorage(origin, schema);
            }
            else {
                if (schema !== undefined)
                    updateStorageSchema(localStorage.roots[origin], schema);
            }
            // Note: creating proxy here avoids issues with serialising a function into local storage, which was an
            // issue with prior forms of data binding (recreation when the data was loaded again).
            proxies[origin] = createProxy(localStorage.roots[origin]);
            return proxies[origin].proxy;
        }

        throw new InvalidOriginException("Unexpected parameter type '" + typeof obj + "' with value: " + obj);
    }

    /**
     *
     * @param origin
     * @param schema
     * @returns {{}}
     */
    function createStorage(origin, schema) {
        var store = {};

        store.origin = origin;
        store.map = {};
        store.schema = {};
        updateStorageSchema(store, schema);

        return store;
    }

    /**
     *
     * @param store
     * @param newSchema
     */
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
                map[key] = createUID(store.origin, raw);
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

    /**
     *
     * @param store
     * @returns {Proxy.revocable}
     */
    function createProxy(store) {
        // TODO do I need to change references to store within config to obj for this to work?
        var config = {
            get: function(obj, prop) {
                if (!store.schema.hasOwnProperty(prop)) {
                    throw new InvalidPropertyException('Attempt to update "' + prop + '" on "' + store.origin +
                        '" storage object. This property is not defined in the schema configuration.');
                }

                var id = store.map[prop];
                return readUID(id);
            },
            set: function(obj, prop, val) {
                if (!store.schema.hasOwnProperty(prop)) {
                    throw new InvalidPropertyException('Attempt to update "' + prop + '" on "' + store.origin +
                        '" storage object. This property is not defined in the schema configuration.');
                }

                var id = store.map[prop];

                switch (store.schema[prop]) {
                    case 'string':
                        if (!setStringUID(id, val)) {
                            throw new UpdateFailedException('Attempt to update "' + prop + '" on "' + store.origin +
                                '" storage object with value "'+ val + '" failed.');
                        }
                        break;

                    case 'number':
                        if (!setNumberUID(id, val)) {
                            throw new UpdateFailedException('Attempt to update "' + prop + '" on "' + store.origin +
                                '" storage object with value "'+ val + '" failed.');
                        }
                        break;

                    default:
                        throw new SchemaException('Schema property "' + prop + '" on "' + store.origin + '" storage ' +
                            'object of type "' + store.schema[prop] + '" is not understood.');
                }
            }
            // Note to self:
            // Define and delete creating children?
            // Would work for complex data objects in the schema perhaps?
            // deleteProperty: function() {},
            // defineProperty: function() {},
            // getPrototypeOf: function() {},
            // setPrototypeOf: function() {}
        };

        // Relies on ES6 existing to work correctly
        // If if doesn't, can do a work around with Object.defineProperty in a loop through the schema properties
        // This would create a data binding object, but it would lack the runtime flexibility of a true proxy
        return new Proxy.revocable(store, config);
    }

    // --------------------------------------------------

    /**
     *
     * @param id
     * @returns {boolean}
     */
    function isUID(id) {
        return localStorage.uids.hasOwnProperty(id);
    }

    /**
     *
     * @param type
     * @param val
     * @param parent
     * @returns {*}
     */
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
        while   ( localStorage.uids.hasOwnProperty(id) );

        localStorage.uids[id] = {
            type:   type,
            data:   val,
            parent: parent
        };

        return id;
    }

    /**
     *
     * @param id
     * @returns {undefined}
     */
    function readUID(id) {
        if (!isUID(id))
            return undefined;
        return localStorage.uids[id].data;
    }

    /**
     *
     * @param id
     * @param val
     * @returns {boolean}
     */
    function updateUID(id, val) {
        if (!isUID(id))
            return false;
        localStorage.uids[id].data = val;
        return true;
    }

    /**
     *
     * @param id
     * @returns {boolean}
     */
    function deleteUID(id) {
        if (!isUID(id))
            return false;
        delete localStorage.uids[id];
        return true;
    }

    // --------------------------------------------------

    /**
     *
     * @param id
     * @param val
     * @returns {boolean}
     */
    function setStringUID(id, val) {
        return updateUID(id, ''+val);
    }

    /**
     *
     * @param id
     * @param val
     * @returns {boolean}
     */
    function setNumberUID(id, val) {
        if (!isNumber(val)) {
            val = parseInt(val);
            if (isNaN(val))
                val = 0;
        }
        return updateUID(id, val);
    }

    // --------------------------------------------------

    /**
     *
     */
    function exportStorage() {
        return JSON.stringify({
            roots: localStorage.roots,
            uids: localStorage.uids
        });
    }

    /**
     *
     * @param data
     * @returns {boolean}
     */
    function importStorage(data) {
        var p = JSON.parse(data);
        if (p.roots && p.uids) {
            // There is no guarantee that any existing member of roots will still be present after import
            // So we need to revoke all existing proxies, forcing the rest of the code to require these
            for (var prox in proxies) {
                prox.revoke();
            }
            proxies = {};
            localStorage.roots = p.roots;
            localStorage.uids = p.uids;
            return true;
        }
        return false;
    }

    // --------------------------------------------------

});

// ======================================================

/**
 * Custom exception for cases where an invalid parameter type is provided as the origin for the storage object.
 *
 * @param message
 * @constructor
 */
function InvalidOriginException(message) {
    this.message = message;
    this.name = "InvalidOriginException";
}

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
 * Custom exception for invalid property access.
 * Used as an indication that an attempt was made to access (read or update) a property that does not exist in the
 * current schema.
 *
 * @param message The message describing a specific cause of this exception.
 * @constructor
 */
function InvalidPropertyException(message) {
    this.message = message;
    this.name = "InvalidPropertyException";
}

/**
 * Custom exception for an error condition when updating a UID.
 * Used to indicate that the internal function updateUID returned false, indicating a problem updating the ID.  As such,
 * this may be an indication that the data stored has somehow become corrupt.
 *
 * @param message
 * @constructor
 */
function UpdateFailedException(message) {
    this.message = message;
    this.name = "UpdateFailedException";
}

// ======================================================

/**
 * Make certain the exception outputs an appropriate message when used as a string (e.g. error console)
 * @returns {string} A combination of the exception name and message.
 */
function exceptionString() {
    return this.name + ": '" + this.message + "'";
}

InvalidOriginException.prototype.toString = exceptionString;
SchemaException.prototype.toString = exceptionString;
InvalidPropertyException.prototype.toString = exceptionString;
UpdateFailedException.prototype.toString = exceptionString;
