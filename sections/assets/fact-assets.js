mod = angular.module('sin.fact.assets', [
    'sin.fact.skills',
    'sin.lib.persist'
]);

mod.factory('assets', function(persist, skills) {
    var factory = {};
    var state = {};

    var job = {};
    var changed = false;

    var defaultState = function() {
        state = {
            job: {
                employer: 'Generic Employer',
                skill: 0,
                spec: 0,
                ranks: 0,
                level: -1
            }
        };
    };

    defaultState();

    // --------------------------------------------------

    persist.registerLoad(function() {
        state = persist.doLoad('sin.fact.assets', state);
    });
    persist.registerSave(function() {
        persist.doSave('sin.fact.assets', state);
    });
    persist.registerWipe(function() {
        defaultState();
    });

    // --------------------------------------------------

    Object.defineProperty(job, 'level', {
        get: function() { return '' + state.job.level; },
        set: function(val) {
            state.job.level = parseInt(val);
            changed = true;
        },
        enumerable: true
    });

    Object.defineProperty(factory, 'job', {
        get: function() { return job; },
        enumerable: true
    });

    Object.defineProperty(factory, 'stateJob', {
        get: function() { return state.job; },
        enumerable: true
    });

    // --------------------------------------------------

    factory.getJob = function() {
        return state.job;
    };

    factory.getFinances = function() {
        return state.finances;
    };

    // --------------------------------------------------

    factory.calcSalary = function(level, ranks) {
        skills.rankSkill(state.job.skill);
        return (level + 1) * ranks * 50;
    };

    // --------------------------------------------------
    // --------------------------------------------------
    // --------------------------------------------------

    return factory;
});
