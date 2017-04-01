// updated 1/12/17, passed testing

(function () {
    'use strict';

    angular
        .module('root')
        .controller('Register1Controller', Register1Controller);

    Register1Controller.$inject = ['$state', 'SessionService', 'SessionFactory', 'RandomStringService', 'UtilityFactory', 'UtilityService', 'Gparams'];
    function Register1Controller(   $state,   SessionService,   SessionFactory,   RandomStringService,   UtilityFactory,   UtilityService,   Gparams) {
        var vm = this;

		vm.theCode = RandomStringService.randomString();
		vm.theCode = "1";																// remove for production     
		SessionFactory.setTheCode(vm.theCode);
		vm.params = Gparams;      
 		vm.setFocus = true;	
 		vm.data = {};
			
		vm.doCancel = function() {$state.go('login');};
		vm.doLogin =  function() {$state.go('login');};
		
		vm.sendCode = function() {
			SessionService.checkEmail(vm.data.email)
           	.then(function successCallback(response) {
    				if (response.status=="200") {
			 			vm.message = {
							to		: vm.data.email,
							subject	: 'Registration code for ' + vm.params.appName + ' web site.',
							body	: 'Paste the following code into the ' + vm.params.appName + ' registration page: ' + vm.theCode,
							headers	: 'From: ' + vm.params.appName + '@Ancestor-tracker.com',
							success	: 'The password registration email from ' + vm.params.appName + ' has been sent.',
							failure	: 'The password registration email from ' + vm.params.appName + ' failed to be sent.'
						};
						UtilityService.sendMail(vm.message)
			 				.then(function successCallback(response) {
			     				if (response.status=="200") {
									UtilityFactory.showTemplateToast('<md-toast>The registration email from ' + vm.params.appName + ' has been sent.</md-toast>');
									SessionFactory.setRegData('email=' + vm.data.email + '&givenName=' + vm.data.givenName + '&surname=' + vm.data.surname);
						        	$state.go('registerCode');

					  			} else {
					  				UtilityFactory.showAlertToast('<md-toast>The registration email from ' + vm.params.appName + ' failed. The error was ' +response.error + ' and ' + vm.params.appName + ' has been notified.</md-toast>');
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
