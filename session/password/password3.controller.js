// updated 1/12/17, passed testing

(function () {
    'use strict';

    angular
        .module('root')
        .controller('Password3Controller', Password3Controller);

    Password3Controller.$inject = ['$state', '$rootScope', 'SessionFactory', 'SessionService', 'UtilityService', 'UtilityFactory', 'Gparams'];
    function Password3Controller(   $state,   $rootScope,   SessionFactory,   SessionService,   UtilityService,   UtilityFactory,   Gparams) {
        var vm = this;
        
  		vm.params = Gparams;
		vm.theData = SessionFactory.getRegData();	
		vm.data = {};
  		vm.setFocus = true;
 
 			
 		vm.doCancel = function() {$state.go('login');};
		
		vm.getPswd = function() {       	
            if (vm.data.password1 != vm.data.password2) {
				UtilityFactory.showAlertToast('<md-toast>The two passwords do not match. Please try again.</md-toast>');
            	vm.password1 = '';
            	vm.password2 = '';
          		return;
            }
            
			vm.theData = vm.theData + '&password=' + vm.data.password1;
			SessionService.changePswd(vm.data)
            	.then(function successCallback(response) {
                   if (response.status=="200") {
                        vm.theData = response.data.mainID.mainID;
                        SessionService.getPerson(vm.theData)
 		                	.then(function successCallback(response) {									// log the person in since they have entered both credentials
 		                		SessionFactory.setCredentials(vm.theData);
		 						UtilityFactory.getNameHistory(vm.theData.surname);
		 						$rootScope.$broadcast('enable main buttons');
								UtilityFactory.showTemplateToast('<md-toast>The password change for ' + vm.params.appName + ' succeeded.</md-toast>');
		                      	$state.go('home');
		            });
 					} else {
						UtilityFactory.showAlertToast('<md-toast>The password change for  ' + vm.params.appName + ' failed. The error was ' + response.error + ' and ' + vm.params.appName + ' has been notified.</md-toast>');
						UtilityService.sendBugReport(response);						
					}
				});
      	};
    }
})();