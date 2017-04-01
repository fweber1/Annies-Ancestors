// updated 2/26/17, passed testing

(function () {
    'use strict';

    angular
        .module('root')
        .controller('Register2Controller', Register2Controller);

    Register2Controller.$inject = ['$state', 'SessionFactory', 'Gparams'];
    function Register2Controller(   $state,   SessionFactory,   Gparams) {
        var vm = this;
        
        vm.params = Gparams;
     	vm.theCode = SessionFactory.getTheCode();
 		vm.setFocus = true;	
			
		vm.doCancel = function() {$state.go('login');};

		vm.checkCode = function() {
	     	if(vm.data.code == vm.theCode) {
	        	$state.go('registerPswd');
	       	} else {

	       	} 
	   	};      
     }

})();
