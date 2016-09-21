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
        state = {};
        defaultJob();
    };

    function defaultJob() {
        state.job = {
            employer: 'Generic Employer',
                skill: 0,
                spec: 0,
                level: -1
        };
    }

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

    Object.defineProperty(job, 'employer', {
        get: function() { return state.job.employer; },
        set: function(val) {
            state.job.employer = '' + val;
            changed = true;
        },
        enumerable: true
    });

    Object.defineProperty(job, 'skill', {
        get: function() { return '' + state.job.skill; },
        set: function(val) {
            state.job.skill = parseInt(val);
            if (isNaN(state.job.skill))
                state.job.skill = 0;
            changed = true;
        },
        enumerable: true
    });

    Object.defineProperty(job, 'spec', {
        get: function() { return '' + state.job.spec; },
        set: function(val) {
            state.job.spec = parseInt(val);
            if (isNaN(state.job.spec))
                state.job.spec = 0;
            changed = true;
        },
        enumerable: true
    });

    Object.defineProperty(job, 'level', {
        get: function() { return '' + state.job.level; },
        set: function(val) {
            state.job.level = parseInt(val);
            changed = true;
        },
        enumerable: true
    });

    // --------------------------------------------------

    Object.defineProperty(factory, 'job', {
        get: function() { return job; },
        enumerable: true
    });

    // --------------------------------------------------

    // TODO remove this and references to it
    factory.getJob = function() {
        return {};
    };

    factory.resetJob = function() {
        defaultJob();
        changed = true;
    };

    factory.calcJobRanks = function() {
        return skills.calcSkillTotal(state.job.skill, state.job.spec, 'job');
    };

    factory.calcSalary = function() {
        if (state.job.level < 0)
            return 0;
        if (state.job.skill == 0)
            return 0;

        var ranks = factory.calcJobRanks();
        return (state.job.level + 1) * ranks * 50;
    };

    // --------------------------------------------------
    // --------------------------------------------------
    // --------------------------------------------------

    return factory;
});
