mod = angular.module('sin.fact', [
    'sin.fact.actions',
    'sin.lib.persist'
]);

mod.factory('dtime', function(actions, persist) {
    var factory = {};
    var state = {};
    var data = {};
    var changed;

    data.calendar = [
        {num: 0,  short: 'Jan', med: 'Jan',   long: 'January'},
        {num: 1,  short: 'Feb', med: 'Feb',   long: 'February'},
        {num: 2,  short: 'Mar', med: 'March', long: 'March'},
        {num: 3,  short: 'Apr', med: 'April', long: 'April'},
        {num: 4,  short: 'May', med: 'May',   long: 'May'},
        {num: 5,  short: 'Jun', med: 'June',  long: 'June'},
        {num: 6,  short: 'Jul', med: 'July',  long: 'July'},
        {num: 7,  short: 'Aug', med: 'Aug',   long: 'August'},
        {num: 8,  short: 'Sep', med: 'Sept',  long: 'September'},
        {num: 9,  short: 'Oct', med: 'Oct',   long: 'October'},
        {num: 10, short: 'Nov', med: 'Nov',   long: 'November'},
        {num: 11, short: 'Dec', med: 'Dec',   long: 'December'}
    ];

    function defaultState() {
        state = {
            currentTab: 'none',

            month: actions.getCurrentMonth(),
            email: '',
            name: '',
            player: '',
            autoLoad : false,
            directSumbit: true,
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

    persist.registerLoad(function() { state = persist.doLoad('sin.fact', state); });
    persist.registerSave(function() {
        persist.doSave('sin.fact', state);
        persist.doSave('autoLoad', state.autoLoad);
        changed = false;
    });
    persist.registerWipe(defaultState);
    persist.registerLongTerm(isChanged);

    //persist.registerShortTerm(isChanged);

    // --------------------------------------------------

    // Read-only, set defaults to undefined
    // If we get multiple read only static data, can implement a for loop to iterate on the content of data
    Object.defineProperty(factory, 'calendar', {
        get: function() {return data.calendar;},
        enumerable: false
    });

    Object.keys(state).forEach(function(item) {
        Object.defineProperty(factory, item, {
            get: function() {return state[item];},
            set: function(val) {
                state[item] = val;
                changed = true;
            },
            enumerable: true
        });
    });

    return factory;
});
