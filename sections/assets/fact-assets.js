mod = angular.module('sin.fact.assets', [
    'sin.fact.skills',
    'sin.lib.persist',
    'sin.lib.registry'
]);

mod.factory('assets', function(persist, registry, skills) {
    var factory = {};
    var state = {};

    var job = {};
    var contacts = {};
    var changed = false;

    var defaultState = function() {
        state = {
            contacts: {}
        };
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
        makeAllBindings();
        changed = false;
    });
    persist.registerSave(function() {
        persist.doSave('sin.fact.assets', state);
        changed = false;
    });
    persist.registerWipe(function() {
        defaultState();
        changed = false;
    });

    // --------------------------------------------------

    Object.defineProperty(job, 'employer', {
        get: function() { return state.job.employer; },
        set: function(val) {
            state.job.employer = val;
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

    Object.defineProperty(factory, 'contacts', {
        get: function() { return contacts; },
        enumerable: true
    });

    // --------------------------------------------------

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

    factory.createContact = function () {
        var key = registry.generateKey('contact');
        state.contacts[key] = {
            name: '',
            type: 1,
            skill: 0
        };
        makeContactBinding(key);
        return key;
    };

    factory.deleteContact = function(id) {
        if (!state.contacts.hasOwnProperty(id))
            return false;
        registry.removeKey(id);
        delete state.contacts[id];
        delete contacts[id];
        return true;
    };

    function makeContactBinding(id) {
        var binding = {};

        function modifier(usage) {
            if (usage == 'job')
                return 0;

            return state.contacts[id].type;
        }

        Object.defineProperty(binding, 'name', {
            get: function() { return state.contacts[id].name; },
            set: function(val) {
                state.contacts[id].name = val;
                changed = true;
            },
            enumerable: true
        });

        Object.defineProperty(binding, 'type', {
            get: function() { return '' + state.contacts[id].type; },
            set: function(val) {
                state.contacts[id].type = parseInt(val);
                if (isNaN(state.contacts[id].type))
                    state.contacts[id].type = 0;
                changed = true;
            },
            enumerable: true
        });

        Object.defineProperty(binding, 'skill', {
            get: function() { return '' + state.contacts[id].skill; },
            set: function(val) {
                var old = state.contacts[id].skill;
                state.contacts[id].skill = parseInt(val);
                changed = true;

                if (isNaN(state.contacts[id].skill))    state.contacts[id].skill = 0;
                if (old > 0 )                           skills.removeModifier(old, id);
                if (state.contacts[id].skill > 0)       skills.addModifier(state.contacts[id].skill, id, modifier);
            },
            enumerable: true
        });

        contacts[id] = binding;
    }

    function makeAllBindings() {
        for (var id in state.contacts) {
            makeContactBinding(id);
        }
    }

    // --------------------------------------------------
    // --------------------------------------------------

    return factory;
});
