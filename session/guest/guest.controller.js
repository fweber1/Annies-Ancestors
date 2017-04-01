// updated 1/12/17, passed testing

(function () {
    'use strict';

    angular
        .module('root')
        .controller('GuestController', GuestController);

    GuestController.$inject = ['$rootScope', 'AddFactory', 'SessionFactory', 'UtilityFactory', 'Gparams'];
    function GuestController(   $rootScope,   AddFactory,   SessionFactory,   UtilityFactory,   Gparams) {
        
        var vm = this;
		vm.params = Gparams;
		
		if(vm.params.debug) {
			var created = [{fullName:'John Edwards Johnson III',mainID:6120},{fullName:'Sarah Lisa Johnson',mainID:6126}];
			AddFactory.setCreatedList(created);
			UtilityFactory.setFamily(vm.params.guestID)
				.then(function successCallback(response) {
					vm.person = response;
				});
			
		} else {
			UtilityFactory.setFamily(vm.params.curUserID);
			vm.person = UtilityFactory.getFamily();			
		}
		
		$rootScope.$broadcast('enable main buttons');
		
		vm.doHome = function() {SessionFactory.doHome();};	     
   	     
     }

})();
