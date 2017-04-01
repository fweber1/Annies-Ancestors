// updated 1/12/17, passed testing

(function () {
    'use strict';

    angular
        .module('root')
        .controller('Register3Controller', Register3Controller);

    Register3Controller.$inject = ['$rootScope', '$state', 'SessionFactory', 'SessionService', 'UtilityFactory', 'UtilityService', 'Gparams'];
    function Register3Controller(   $rootScope,   $state,   SessionFactory,   SessionService,   UtilityFactory,   UtilityService,   Gparams) {
        var vm = this;
        
        vm.params = Gparams;       
 		vm.setFocus = true;	
 		vm.theData = SessionFactory.getRegData();	
		vm.doCancel = function(){SessionFactory.doCancel();};
	
 		vm.getPswd = function() {       	
            if (vm.data.password != vm.data.password2) {
				UtilityFactory.showAlertToast('<md-toast>The two passwords do not match. Please try again.</md-toast>');
            	vm.data = {};
          		return;
            }

			vm.theData = vm.theData + '&password=' + vm.data.password;
			SessionService.createUser(vm.theData)
            	.then(function successCallback(response) {
               		if (response.status=="200") {
                        vm.theData.mainID = response.data.mainID;
                        console.log(response);
		                SessionService.getPerson(theData.mainID)
 		                	.then(function successCallback(response) {									// log the person in since they have entered both credentials
 		                		SessionFactory.setCredentials(vm.theData);
		 						UtilityFactory.getNameHistory(theData.surname);
		 						$rootScope.$broadcast('enable main buttons');
								UtilityFactory.showTemplateToast('<md-toast>The registration for ' + vm.params.appName + ' succeeded.</md-toast>');
		                      	$state.go('home');
		            });
 					} else {
						UtilityFactory.showAlertToast('<md-toast>The registration with  ' + vm.params.appName + ' failed. The error was ' +response.data.error + ' and ' + vm.params.appName + ' has been notified.</md-toast>');
						UtilityService.sendBugReport(response);						
					}
				});
      	};
             }

})();
