mod = angular.module('sin.lib.persist', []);

mod.factory('persist', function($rootScope) {
    var factory = {};
    var autoLoad = false;

    var external_on = false;
    //var external_file = '';

    // --------------------------------------------------

    factory.isStorageAvailable = function() {
        return (typeof(Storage) !== "undefined");
    };

    factory.isStorageSaved = function() {
        return factory.isStorageAvailable() && (localStorage.saved);
    };

    factory.autoLoadOn = function() {
        autoLoad = true;
        factory.eventLoad();
    };

    // --------------------------------------------------

    factory.eventLoad = function() {
        $rootScope.$emit('sinDTimeLoad');
    };

    factory.eventSave = function() {
        localStorage.saved = true;
        $rootScope.$emit('sinDTimeSave');
    };

    factory.eventWipe = function() {
        $rootScope.$emit('sinDTimeWipe');
        factory.eventSave();
    };

    factory.eventReset = function() {
        factory.eventWipe();
        $rootScope.$emit('sinDTimeReset');
        localStorage.clear();
    };

    // --------------------------------------------------

    // Done to resolve bug with load event called before the functions registered
    // in other modules are set up
    if (factory.isStorageAvailable()) {
        if (factory.isStorageSaved()) {
            if (JSON.parse(localStorage.autoLoad)) {
                factory.autoLoadOn();
            }
        }
    }

    // --------------------------------------------------

    factory.registerLoad = function(listen) {
        $rootScope.$on('sinDTimeLoad', listen);
        if (autoLoad) {
            listen();
        }
    };

    factory.registerSave = function(listen) {
        $rootScope.$on('sinDTimeSave', listen);
    };

    factory.registerWipe = function(listen) {
        $rootScope.$on('sinDTimeWipe', listen);
    };

    factory.registerReset = function(listen) {
        $rootScope.$on('sinDTimeReset', listen);
    };

    // --------------------------------------------------

    factory.doLoad = function(key, data) {
        if (localStorage[key] === undefined) {
            return data;
        }

        if (external_on) {}
        else
            return JSON.parse(localStorage[key]);
    };

    factory.doSave = function(key, data) {
        if (external_on) {}
        else
            localStorage[key] = JSON.stringify(data);
    };

    // --------------------------------------------------

    factory.beginExport = function() { //file) {
        //noinspection JSUnusedAssignment
        external_on = true;
        //external_file = file;
        factory.eventSave();
        external_on = false;
        //external_file = '';
    };

    factory.beginImport = function() { //file) {
        //noinspection JSUnusedAssignment
        external_on = true;
        //external_file = file;
        factory.eventLoad();
        external_on = false;
        //external_file = '';
    };

    // --------------------------------------------------

    var shortChange = [];
    var longChange = [];

    factory.registerShortTerm = function (register) {
        if (typeof register !== "function")
            return false;

        shortChange += register;
        return true;
    };

    factory.registerLongTerm = function (register) {
        if (typeof register !== "function")
            return false;

        longChange += register;
        return true;
    };

    factory.isShortTermChange = function() {
        for (var i = 0; i < shortChange.length; i++) {
            if (shortChange[i]())
                return true;
        }

        return false;
    };

    factory.isLongTermChange = function() {
        for (var i = 0; i < longChange.length; i++) {
            if (longChange[i]())
                return true;
        }

        return false;
    };

    // --------------------------------------------------

    factory.dataFetch = function(key, ajax, data_func, error_func, cache) {
        if (ajax === undefined)               return false;
        if (typeof data_func !== "function")  return false;
        if (typeof error_func !== "function") return false;
        if (cache === undefined)              cache = 1000;
        if (typeof cache !== "number")        return false;

        if (localStorage[key] !== undefined) {
            var data = localStorage[key];
            // Key and ajax should ALWAYS be consistent
            // i.e. key should always be retrieving the same information
            if (data.ajax != ajax)
                return false;

            if (Date.now() < data.cache_expire) {
                // Use the informations stored, because we are still caching
                data_func(data.result);
                return true;
            }
        }

        function success_call (response){ //, status, headers, config) {
            var data = {
                key: key,
                ajax: ajax,
                cache_expire: Date.now() + cache,
                result: JSON.parse(response)
            };
            localStorage[key] = data;
            data_func(data.result);
        }

        function error_call () { //response, status, headers, config) {
            // Ajax error
            // So if we have previously cached the data, we now use that
            // i.e. if we can't get more up to date information we use what we
            // already have, but still log the error
            if (localStorage[key] !== undefined) {
                var data = localStorage[key];
                error_func(data.result);
            } else {
                error_func();
            }
        }

        $http.get(ajax).then(success_call, error_call);

        return true;
    };

    // --------------------------------------------------

    // Not currently used due to lack of server linked to this project

    /*
    factory.dataPost = function(key, ajax, post, data_func, error_func) {
        if (ajax === undefined)                 return false;
        if (typeof data_func !== "function")    return false;
        if (typeof error_func !== "function")   return false;
        if (localStorage[key] === undefined)    return false;
        if (post === undefined)                 post = {};

        function successCall () {
            
        }
        
        function errorCall () {
            
        }

        $http.post(ajax, localStorage[key], post).then(successCall, errorCall);

        return true;
    };
    */

    return factory;
});
