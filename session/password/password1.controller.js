// updated 1/12/17, passed testing

(function () {
    'use strict';

    angular
        .module('root')
        .controller('Password1Controller', Password1Controller);

    Password1Controller.$inject = ['$state', 'SessionFactory', 'SessionService', 'UtilityFactory', 'UtilityService', 'RandomStringService', 'Gparams'];
    function Password1Controller(   $state,   SessionFactory,   SessionService,   UtilityFactory,   UtilityService,   RandomStringService,   Gparams) {
        var vm = this;

		vm.theCode = RandomStringService.randomString();
		vm.theCode = "1";																// remove for production     
		SessionFactory.setTheCode(vm.theCode);
		vm.params = Gparams;      
 		vm.setFocus = true;	
 		vm.data = {};
			
		vm.doCancel = function() {$state.go('login');};
		
		vm.sendCode = function() {
			SessionService.checkEmail(vm.data.email)
           	.then(function successCallback(response) {
    				if (response.status=="200") {
			 			vm.message = {
							to		: vm.data.email1,
							subject	: 'Email change code for ' + vm.params.appName + ' web site.',
							body	: 'Paste the following code into the ' + vm.params.appName + ' email change page: ' + vm.theCode,
							headers	: 'From: ' + vm.params.appName + '@Ancestor-tracker.com',
							success	: 'The password change email from ' + vm.params.appName + ' has been sent.',
							failure	: 'The password change email from ' + vm.params.appName + ' failed to be sent.'
						};
						UtilityService.sendMail(vm.message)
			 				.then(function successCallback(response) {
			     				if (response.status=="200") {
									UtilityFactory.showTemplateToast('<md-toast>The password change email from ' + vm.params.appName + ' has been sent.</md-toast>');
									SessionFactory.setRegData('email=' + vm.data.email);
						        	$state.go('passwordCode');

					  			} else {
					  				UtilityFactory.showAlertToast('<md-toast>The password change email from ' + vm.params.appName + ' failed. The error was ' +response.error + ' and ' + vm.params.appName + ' has been notified.</md-toast>');
									UtilityService.sendBugReport(vm.data);

					 			}
							});
					} else {
						UtilityFactory.showAlertToast('<md-toast>An invalid email was entered. Please try again.</md-toast>');				
					}
				});
		};
  	}
})();