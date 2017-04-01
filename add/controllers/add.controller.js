// ******************************************************
//
// Person Controller
//
// ******************************************************

(function () {    'use strict';

    angular
		.module('root')
        .controller('AddController', AddController)
 
    	.config(function() {	  		
		});
		
    	AddController.$inject = ['$state', '$scope', '$stateParams', '$rootScope', 'Gparams'];
   		function AddController(   $state,   $scope,   $stateParams,   $rootScope,   Gparams) {
 
   			var vm = this;
   			var tabCntl;
   			vm.params = Gparams;
  			if(vm.params.debug) {
   				vm.disabledTabs = false; 
   			} else {
   				vm.disabledTabs = true; 
   			}
   			vm.tab = 0;
   			$rootScope.rs.addSelectedTab = 0;
   			vm.havePerson = false;

   			vm.tabs = ['addName', 'addEvents', 'addAttributes', 'addMarriages', 'addStories', 'addMedia', 'addFamily'];
 
 			tabCntl = $scope.$watch('rs.addSelectedTab', function(current, old) {
 				tabCntl = $scope.$watch('rs.editSelectedTab', function(current, old) {
 					try {
 		   				vm.tab = $stateParams.obj.tab;
 		  				$rootScope.rs.addSelectedTab = current;
 		  				$state.go(vm.tabs[current]);
 		  			} catch(err) {
 		  				$state.go(vm.tabs[$rootScope.rs.addSelectedTab]);
 		  			}
 				});
   			});

}
})
();
