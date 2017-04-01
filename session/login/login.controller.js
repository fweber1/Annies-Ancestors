// updated 1/12/17, passed testing

(function () {    'use strict';

    angular
        .module('root')
        .controller('LoginController', LoginController);
  
   LoginController.$inject = ['$state', '$rootScope', 'SessionFactory', 'SessionService', 'UtilityFactory', 'Gparams'];
   function LoginController(   $state,   $rootScope,   SessionFactory,   SessionService,   UtilityFactory,   Gparams) {
        var vm = this;
        vm.setFocus = true;
        
 		vm.params = Gparams;
      	vm.showEmailLink = true;
        vm.showGuest = true;
 		vm.showRegister = true;
 		vm.showCancel = false;
 		       		
		UtilityFactory.getTodayInHistory();

		vm.doRegister = function() {$state.go('register');};						// connect click function to the SessionFactory
		vm.doEmail = function()    {$state.go('email');};
		vm.doPassword = function() {$state.go('password');};
		vm.doGuest = function()    {$state.go('guest');};							 			
  		
		vm.doLogin = function() {
  			SessionService.login(vm.data)
            	.then(function successCallback(response) {	
            		if (response.status=="200") {
            			var theData = response.data.response.mainID;
            			SessionFactory.setCredentials(theData);
						SessionService.getPerson(theData)
			            	.then(function successCallback(response) {	
			            		if (response.status=="200") {
									Gparams.canSave = true;
									Gparams.mainDisabled = false;
			 						UtilityFactory.getNameHistory(theData.surname);
			 						$rootScope.$broadcast('enable main buttons');
			 						$state.go('home');
									Gparams.canSave = true;
									Gparams.mainDisabled = false;
			 						UtilityFactory.getNameHistory(theData.surname);
			 						$rootScope.$broadcast('enable main buttons');
		  							UtilityFactory.showTemplateToast('<md-toast>The login to ' + vm.params.appName + ' succeeded.</md-toast>');				
			 						$state.go('home');
			  					} else {
		  							UtilityFactory.showAlertToast('<md-toast>The login failed with error message: ' + response.data.error + '. ' + vm.params.appName + ' has been notified.</md-toast>');				
									UtilityService.sendBugReport(response);
								}
			  
			            	});
            		} else {
						UtilityFactory.showAlertToast('<md-toast>The login failed with error message: ' + response.data.error + '. ' + vm.params.appName + ' has been notified.</md-toast>');		
						UtilityService.sendBugReport(response);
				}
        		});
			};
   }
})();