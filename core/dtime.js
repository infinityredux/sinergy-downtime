// Note to self:
// http://blog.thoughtram.io/angularjs/2015/01/02/exploring-angular-1.3-bindToController.html
// http://www.w3schools.com/angular/angular_sql.asp
//
// http://newrelic.com/
//

// Central module that requires everything else
// Ensures that all modules actually get loaded

mod = angular.module('sin.dtime', [
    'sin.dtime.form',
    'sin.dtime.main',

    'sin.dtime.actions',
    'sin.dtime.actions-slot',
    'sin.dtime.assets',
    'sin.dtime.equip',
    'sin.dtime.events',
    'sin.dtime.lifestyle',
    'sin.dtime.money',
    'sin.dtime.skills',
    'sin.dtime.skills-selectors',

    'sin.fact',
    'sin.fact.actions',
    'sin.fact.assets',
    'sin.fact.equip',
    'sin.fact.lifestyle',
    'sin.fact.money',
    'sin.fact.skills',

    'sin.lib.fieldset',
    'sin.lib.help',
    'sin.lib.persist',
    'sin.lib.panes'
]);
