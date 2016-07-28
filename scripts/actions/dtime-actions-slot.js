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
        templateUrl: 'fragments/dtime-actions-slot.html',
        controllerAs: 'actSlot',
        controller: ActionSlotController
    };
});

function ActionSlotController($scope, actions, assets, money, skills) {
    $scope.skills = skills;
    this.disableJobEdit = (assets.getJob().level>0);

    this.getLegend = function() {
        if (this.slot.filter === "player") {
            return "Slot " + (this.num + 1) + " - " + this.slot.desc + ":";
        }
        else if (this.slot.filter === "contact") {
            return this.slot.desc +" (" + "insert contact name here" + "):";
        }
        else {
            return this.slot.desc +" (hired help):";
        }
    };

    this.getSkillName = function() {
        if (this.slot.spec) {
            return (skills.treeSkillName(this.slot.skill) + '/' +
            skills.treeSpecName(this.slot.skill,this.slot.spec));
        }
        //Otherwise
        return skills.treeSkillName(this.slot.skill);
    };

    this.getTotalSkill = function() {
        if (this.slot.filter == 'player') {
            var plusses = (this.slot.ranks_spec ? this.slot.ranks_spec : 0)
                + (this.slot.bonus_skill ? this.slot.bonus_skill : 0)
                + (this.slot.bonus_spec ? this.slot.bonus_spec : 0);

            if (plusses > 4) {
                plusses = Math.floor((plusses - 4) / 2) + 4;
            }

            return this.slot.ranks_skill + plusses;
        }

        //TODO: implement non-player stuff
        return 0;
    };

    this.calcSalary = function() {
        if (isNaN(parseInt(this.slot.level))) return 0;
        if (isNaN(this.getTotalSkill())) return 0;
        return assets.calcSalary(parseInt(this.slot.level), this.getTotalSkill());
    };

    this.updateJob = function() {
        if (isNaN(parseInt(this.slot.level))) return;
        if (isNaN(this.getTotalSkill())) return;

        var job = assets.getJob();
        job.employer = this.slot.employer;
        job.skill = this.slot.skill;
        job.spec = this.slot.spec;
        job.ranks = this.getTotalSkill();
        job.level = parseInt(this.slot.level);

        this.slot.money = this.calcSalary();
        money.changeMoney(this.slot.keyMoney, this.slot.money);

        this.disableJobEdit = true;
    };

    this.removeClick = function() {
        if (confirm("This will remove the action. Are you sure?")) {
            if (this.slot.keyMoney) {
                money.removeMoney(this.slot.keyMoney);
            }
            actions.removeActionNum(this.slot.filter, this.num);
            this.ctrl.externalChange();
        }
    };

    if (this.disableJobEdit && (this.slot.action == 'emp' || this.slot.action == 'over')) {
        var job = assets.getJob();
        this.slot.employer = job.employer;
        this.slot.skill = job.skill;
        this.slot.spec = job.spec;
        this.slot.ranks_skill = skills.treeSkillRank(job.skill);
        this.slot.ranks_spec = skills.treeSpecRank(job.skill, job.spec);
        this.slot.level = job.level;
        if (this.slot.action == 'emp')
            this.slot.money = this.calcSalary();
        else
            this.slot.money = this.calcSalary()/2;
        money.changeMoney(this.slot.keyMoney, this.slot.money);
    }
}
