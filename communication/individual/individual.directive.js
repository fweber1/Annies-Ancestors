   angular
     .module('root')
		
 	.directive('individual', function() {
		return {
			restrict: "E",
			templateUrl: '/communication/individual/individual.html'
		};
	})
	
 	.directive('individualdetail', function() {
		return {
			restrict: "E",
			templateUrl: '/sheet/parent.html'
		};
	})