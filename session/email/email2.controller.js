// updated 1/12/17, passed testing

(function () {
    'use strict';

    angular
        .module('root')
        .controller('Email2Controller', Email2Controller);

    Email2Controller.$inject = ['$state', '$rootScope', 'UtilityFactory', 'UtilityService', 'SessionService',  'Gparams'];
    function Email2Controller(   $state,   $rootScope,   UtilityFactory,   UtilityService,   SessionService,    Gparams) {
        var vm = this;
        
        vm.params = Gparams;
		vm.setFocus = true;	
		vm.data = {};
		vm.data.mainID = vm.params.curUserID;
		
 		vm.doCancel = function() {$state.go('login');};				
      		
		vm.changeEmail = function() {
           if (vm.data.email1!=vm.data.email2) {
 				UtilityFactory.showAlertToast('<md-toast>The two emails do not match. Please reenter./md-toast>');
            	vm.data.email1 = '';
               	vm.data.email2 = '';
                vm.data.mainID = vm.params.curUserID;
 				return;
           	}
             SessionService.changeEmail(vm.data)
            	.then(function successCallback(response) {           		
      				if (response.status=='200') {
 						UtilityFactory.showTemplateToast('<md-toast>The email change for ' + vm.params.appName + ' succeeded.</md-toast>');
						Gparams.canSave = true;
						Gparams.mainDisabled = false;
 						UtilityFactory.getNameHistory(vm.data.surname);
 						$rootScope.$broadcast('enable main buttons');
                       	$state.go('home');
                     } else {
 						UtilityFactory.showAlertToast('<md-toast>The email change for ' + vm.params.appName + ' failed with the error:' + response.data.error + '.' + vm.params.appName +' has been notified</md-toast>');
 						UtilityService.sendBugReport(response);
 		            	vm.data = {};
                   }
                });
       };
 	}

})();
