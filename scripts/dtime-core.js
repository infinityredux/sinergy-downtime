/**
 * Created by kedom on 29/07/2016.
 */

mod = angular.module('sin.core', ['sin.lib.persist']);

mod.factory('dtime', function(persist) {
    var factory = {};
    var state = {};
    var data = {};
    var changed;

    // TODO remove duplication with fact-actions

    data.months =[
        { num: 0,  month: 'January' },
        { num: 1,  month: 'February' },
        { num: 2,  month: 'March' },
        { num: 3,  month: 'April' },
        { num: 4,  month: 'May' },
        { num: 5,  month:'June' },
        { num: 6,  month: 'July' },
        { num: 7,  month: 'August' },
        { num: 8,  month: 'September' },
        { num: 9,  month: 'October' },
        { num: 10, month: 'November' },
        { num: 11, month: 'December' }
    ];

    /*
    factory.data = {
        months: [
            {short: 'Jan', med: 'Jan',   long: 'January'},
            {short: 'Feb', med: 'Feb',   long: 'February'},
            {short: 'Mar', med: 'March', long: 'March'},
            {short: 'Apr', med: 'April', long: 'April'},
            {short: 'May', med: 'May',   long: 'May'},
            {short: 'Jun', med: 'June',  long: 'June'},
            {short: 'Jul', med: 'July',  long: 'July'},
            {short: 'Aug', med: 'Aug',   long: 'August'},
            {short: 'Sep', med: 'Sept',  long: 'September'},
            {short: 'Oct', med: 'Oct',   long: 'October'},
            {short: 'Nov', med: 'Nov',   long: 'November'},
            {short: 'Dec', med: 'Dec',   long: 'December'}
        ]
    };
    */

    function defaultState() {
        state = {
            showHelp: true
        };
        changed = false;
    }

    defaultState();

    // --------------------------------------------------

    function isChanged() {
        return changed;
    }

    // --------------------------------------------------

    persist.registerLoad(function() {
        state = persist.doLoad('sin.core', state);
    });

    persist.registerSave(function() {
        persist.doSave('sin.core', state);
        changed = false;
    });

    persist.registerWipe(function() {
        defaultState();
    });

    //persist.registerShortTerm(isChanged);
    persist.registerLongTerm(isChanged);

    // --------------------------------------------------

    // Read-only, set defaults to undefined
    // If we get multiple read only static data, can implement a for loop to iterate on the content of data
    Object.defineProperty(factory, 'months', {
        get: function() { return data.months; },
        enumerable: true
    });

    Object.defineProperty(factory, 'showHelp', {
        get: function() {return state.showHelp;},
        set: function(val) {
            state.showHelp = val;
            changed = true;
        },
        enumerable: true
    });

    /*
    Object.defineProperty(factory, 'session', {
        get: function() {return state.session;},
        set: function(val) {
            state.session = val;
            changed = true;
        },
        enumerable: true
    });
    */

    return factory;
});
