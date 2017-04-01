   angular
     .module('root')

	.directive('file', function () {
    	return {
    		scope: {
    		file: '='
    	},
        link: function (scope, el, attrs) {
            unsubscribe.el.bind('change', function (event) {
                var file = event.target.files[0];
                scope.file = file ? file : undefined;
            });
	        el.on('$destroy', function() {
				angular.element(el).off('change', unsubscribe);           
			});
        }
        }
        });