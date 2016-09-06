mod = angular.module('sin.lib.help', []);

mod.directive('sinHelp', function() {
    return {
        restrict: 'E',
        transclude: true,
        scope: {
            show: '=',
            help: '='
        },
        template: '<span class="help-box" ng-attr-title="{{help}}">[?]</span>'
        /*    link: function(scope, element, attrs){
         $(element).hover(function(){
         $(element).tooltip('show');
         }, function(){
         $(element).tooltip('hide');
         });
         },*/
    };
});