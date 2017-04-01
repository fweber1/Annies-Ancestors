   angular
        .module('root')
		
 	.directive('gedcom', function() {
		return {
		restrict: "E",
		templateUrl: 'communication/gedcom/gedcom.html',
		controller: function($scope, UtilityFactory) {
			
		}
	};
})
