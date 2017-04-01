// updated 1/12/17, passed testing

(function () {
    'use strict';

    angular
        .module('root')
        .controller('Password2Controller', Password2Controller);

    Password2Controller.$inject = ['$state', 'SessionFactory', 'Gparams'];
    function Password2Controller(   $state,   SessionFactory,   Gparams) {
        var vm = this;
        
        vm.params = Gparams;
     	vm.theCode = SessionFactory.getTheCode();
 		vm.setFocus = true;	
			
		vm.doCancel = function() {$state.go('login');};

		vm.checkCode = function() {
	     	if(vm.data.code == vm.theCode) {
	        	$state.go('passwordChange');
	       	} else {

	       	} 
	   	};      
     }
})();