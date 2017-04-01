   angular
        .module('root')
		
 	.directive('email', function() {
		return {
		restrict: "E",
		templateUrl: 'communication/email/email.html',
	};
})