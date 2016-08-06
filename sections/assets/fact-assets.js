mod = angular.module('sin.fact.assets', [
    'sin.fact.skills',
    'sin.lib.persist'
]);

mod.factory('assets', function(persist, skills) {
    var factory = {};
    var state = {};

    var defaultState = function() {
        state = {
            job: {
                employer: 'Default Employer',
                skill: 0,
                spec: 0,
                ranks: 0,
                level: 0
            },
            finances: {
                onHand: 0,
                stored: 0,
                debt: 0
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
