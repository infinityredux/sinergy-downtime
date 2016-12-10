mod = angular.module('sin.lib.events', []);

mod.factory('events', function() { //$rootScope) {
    var factory = {};
    var events = {};

    // --------------------------------------------------

    factory.deregister = removeListener;
    factory.fire = emitEvent;
    factory.register = registerListener;

    // --------------------------------------------------

    function registerListener(event, listen) {
        if (!events.hasOwnProperty(event)) {
            events[event] = [];
        }
        events[event].push(listen);
    }

    function removeListener(event, listen) {
        if (!events.hasOwnProperty(event))
            return false;
        var loc = events[event].indexOf(listen);
        if (loc < -1)
            return false;
        events[event].splice(loc, 1);
        return true;
    }

    function emitEvent(event) {
        if (!events.hasOwnProperty(event))
            return false;
        events[event].forEach(function (listen) { listen(); });
        return true;
    }

    // --------------------------------------------------

    // NOTE:
    // Mostly included for personal reference / preservation of the previous mechanic
    // This was the mechanism used by the original persistence library
/*
    function registerRoot(event, listen) {
        $rootScope.$on(event, listen);
    }

    function emitRoot(event) {
        $rootScope.$emit(event);
    }
*/
    // --------------------------------------------------

    return factory;
});
