(function () {
    'use strict';
    angular // jshint ignore:line
     .module('root')

	 .directive('file', function () {
    	return {
            scope: {
                file: '='
            },
            link: function (scope, el) {
                unsubscribe.el.bind('change', function (event) { // jshint ignore:line
                    var file = event.target.files[0];
                    scope.file = file ? file : undefined;
                });
                el.on('$destroy', function () {
                    angular.element(el).off('change', unsubscribe); // jshint ignore:line
                });
            }
        };
    });
})();