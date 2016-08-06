mod = angular.module('sin.dtime.actions-slot', [
    'sin.dtime.skills',
    'sin.fact.actions',
    'sin.fact.assets',
    'sin.fact.money',
    'sin.fact.skills',
    'sin.lib.general',
    'sin.lib.persist'
]);

mod.directive('dtActionSlot', function() {
    return {
        restrict: 'E',
        scope: true,
        bindToController: {
            slot: '=',
            num: '=',
            ctrl: '='
        },
        templateUrl: 'fragments/actions-slot.html',
        controllerAs: 'actSlot',
        controller: ActionSlotController
    };
});

function ActionSlotController($scope, actions, assets, money, skills) {
    var ctrl = this;
    $scope.skills = skills;
    ctrl.disableJobEdit = (assets.getJob().level>0);

    ctrl.getLegend = function() {
        if (ctrl.slot.filter === "player") {
            return "Slot " + (ctrl.num + 1) + " - " + ctrl.slot.desc + ":";
        }
        else if (ctrl.slot.filter === "contact") {
            return ctrl.slot.desc +" (" + "insert contact name here" + "):";
        }
        else {
            return ctrl.slot.desc +" (hired help):";
        }
    };

    ctrl.getSkillName = function() {
        if (ctrl.slot.spec) {
            return (skills.nameSkill(ctrl.slot.skill) + '/' +
            skills.nameSpec(ctrl.slot.skill,ctrl.slot.spec));
        }
        //Otherwise
        return skills.nameSkill(ctrl.slot.skill);
    };

    ctrl.getTotalSkill = function() {
        if (ctrl.slot.filter == 'player') {
            var plusses = (ctrl.slot.ranks_spec ? ctrl.slot.ranks_spec : 0)
                + (ctrl.slot.bonus_skill ? ctrl.slot.bonus_skill : 0)
                + (ctrl.slot.bonus_spec ? ctrl.slot.bonus_spec : 0);

            if (plusses > 4) {
                plusses = Math.floor((plusses - 4) / 2) + 4;
            }

            return ctrl.slot.ranks_skill + plusses;
        }

        //TODO: implement non-player stuff
        return 0;
    };

    ctrl.calcSalary = function() {
        if (isNaN(parseInt(ctrl.slot.level))) return 0;
        if (isNaN(ctrl.getTotalSkill())) return 0;
        return assets.calcSalary(parseInt(ctrl.slot.level), ctrl.getTotalSkill());
    };

    ctrl.updateJob = function() {
        if (isNaN(parseInt(ctrl.slot.level))) return;
        if (isNaN(ctrl.getTotalSkill())) return;

        var job = assets.getJob();
        job.employer = ctrl.slot.employer;
        job.skill = ctrl.slot.skill;
        job.spec = ctrl.slot.spec;
        job.ranks = ctrl.getTotalSkill();
        job.level = parseInt(ctrl.slot.level);

        ctrl.slot.money = ctrl.calcSalary();
        money.changeMoney(ctrl.slot.keyMoney, ctrl.slot.money);

        ctrl.disableJobEdit = true;
    };

    ctrl.removeClick = function() {
        if (confirm("This will remove the action. Are you sure?")) {
            if (ctrl.slot.keyMoney) {
                money.removeMoney(ctrl.slot.keyMoney);
            }
            actions.removeActionNum(ctrl.slot.filter, ctrl.num);
            ctrl.ctrl.externalChange();
        }
    };

    if (ctrl.disableJobEdit && (ctrl.slot.action == 'emp' || ctrl.slot.action == 'over')) {
        var job = assets.getJob();
        ctrl.slot.employer = job.employer;
        ctrl.slot.skill = job.skill;
        ctrl.slot.spec = job.spec;
        ctrl.slot.ranks_skill = skills.rankSkill(job.skill);
        ctrl.slot.ranks_spec = skills.rankSpec(job.skill, job.spec);
        ctrl.slot.level = job.level;
        if (ctrl.slot.action == 'emp')
            ctrl.slot.money = ctrl.calcSalary();
        else
            ctrl.slot.money = ctrl.calcSalary()/2;
        money.changeMoney(ctrl.slot.keyMoney, ctrl.slot.money);
    }
}
