// Code goes here

mod = angular.module('sin.fact.persist', []);

mod.factory('persist', function($rootScope) {
  var serv = {};
  var auto_load = false;
  var external_on = false;
  var external_file = '';

  // --------------------------------------------------

  serv.isStorageAvailable = function() {
    return (typeof(Storage) !== "undefined");
  };
  
  serv.isStorageSaved = function() {
    return serv.isStorageAvailable() && (localStorage.saved);
  };

  serv.setAutoLoad = function() {
    auto_load = true;
    serv.eventLoad();
  };
  
  serv.beginExport = function(file) {
    external_on = true;
    external_file = file;
    serv.eventSave();
    external_on = false;
    external_file = '';
  };

  serv.beginImport = function(file) {
    external_on = true;
    external_file = file;
    serv.eventLoad();
    external_on = false;
    external_file = '';
  };

  // --------------------------------------------------
  
  serv.doLoad = function(key, data) {
    if (localStorage[key] === undefined) {
      return data;
    }
    //if (external_on) {}
    return JSON.parse(localStorage[key]);
  };
  
  serv.doSave = function(key, data) {
    //if (external_on) {}
    localStorage[key] = JSON.stringify(data);
  };

  // --------------------------------------------------

  serv.dataFetch = function(key, ajax, data_func, error_func, cache) {
    if (ajax === undefined)               return false;
    if (typeof data_func !== "function")  return false;
    if (typeof error_func !== "function") return false;
    if (cache === undefined)              cache = 1000;
    if (typeof cache !== "number")        return false;
    
    if (localStorage[key] !== undefined) {
      var data = JSON.parse(localStorage[key]);
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
    
    var success_call = function(response, status, headers, config) {
      var data = {
        key: key,
        ajax: ajax,
        cache_expire: Date.now() + cache,
        result: JSON.parse(response),
      };
      localStorage[key] = JSON.stringify(data);
      data_func(data.result);
    };
    
    var error_call = function(response, status, headers, config) {
      // Ajax error
      // So if we have previously cached the data, we now use that
      // i.e. if we can't get more up to date information we use what we 
      // already have, but still log the error
      if (localStorage[key] !== undefined) {
        var data = JSON.parse(localStorage[key]);
        error_func(data.result);
      } else {
        error_func();
      }
    };
    
    $http.get(ajax).success(success_call).error(error_call);
    
    return true;
  };
  
  // --------------------------------------------------
  
  // TODO implement this, but later
  // needs to be one of the last stages of this, since will integrate
  // with server database and allowed functions
  serv.dataPost = function(key, ajax, post, data_func, error_func, cache) {
    return false;
  };
  
  // --------------------------------------------------
  
  serv.registerLoad = function(listen) {
    $rootScope.$on('sinDTimeLoad', listen);
    if (auto_load) {
      listen();
    }
  };
  
  serv.registerSave = function(listen) {
    $rootScope.$on('sinDTimeSave', listen);
  };
  
  serv.registerWipe = function(listen) {
    $rootScope.$on('sinDTimeWipe', listen);
  };
  
  serv.registerReset = function(listen) {
    $rootScope.$on('sinDTimeReset', listen);
  };
  
  // --------------------------------------------------

  serv.eventLoad = function() {
    $rootScope.$emit('sinDTimeLoad');
  };
  
  serv.eventSave = function() {
    $rootScope.$emit('sinDTimeSave');
  };
  
  serv.eventWipe = function() {
    $rootScope.$emit('sinDTimeWipe');
    serv.eventSave();
  };

  serv.eventReset = function() {
    $rootScope.$emit('sinDTimeReset');
    localStorage.clear();
    serv.eventWipe();
  };

  // --------------------------------------------------

  return serv;
});
