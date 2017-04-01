// updated 1/12/17, passed testing

(function () {
    'use strict';

    angular
        .module('root')
        .controller('Email1Controller', Email1Controller);

    Email1Controller.$inject = ['$state', 'SessionService', 'UtilityFactory', 'UtilityService', 'Gparams'];
    function Email1Controller(   $state,   SessionService,   UtilityFactory,   UtilityService,   Gparams) {
        var vm = this;
        
        vm.params = Gparams;
        vm.showEmailLink = false;
        vm.showGuest = false;
		vm.showRegister = false;
		vm.showCancel = true;
		vm.setFocus = true;
		
 		vm.doPassword = function() {$state.go('password');};
		vm.doCancel = function() {$state.go('login');};
		
		vm.doLogin = function() {
			SessionService.login(vm.data)
            	.then(function successCallback(response) {	
            		if(response === null) {
						UtilityFactory.showAlertToast('<md-toast>The email change failed. The error was ' +response.data.error + ' and ' + vm.params.appName + ' has been notified.</md-toast>');
						UtilityService.sendBugReport(response);
            		} else {
 	             		Gparams.curUserID = response.data.response.mainID;
	             		Gparams.curPersonID = response.data.response.mainID;
	 		        	$state.go('changeEmail');
            		}
            });
       };
 		
 	}

})();
