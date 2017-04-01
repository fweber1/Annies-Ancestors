/*******************************************************

 Person Controller

 to do:
 
 	add others to family DB
 	add others to getFamily.php
 	
 *******************************************************/

(function () {    'use strict';

    angular
		.module('root')
        .controller('EditFamilyController', EditFamilyController)
    
    	.config(function() {	  		
		});
		
    EditFamilyController.$inject = [ '$scope','$state', '$mdDialog', 'EditService', 'UtilityFactory', 'Gparams'];
   		function EditFamilyController($scope, $state,   $mdDialog,   EditService,   UtilityFactory,   Gparams) {
   
   	  		var vm = this;

			vm.data = {};
			vm.data.ownerID = 0;
  			vm.params = Gparams;
   			vm.setFocus = true;
   			vm.tab = 6;

  			vm.doChange6 = doChange6;														//prototype function declaration so can be callled before defined
  			vm.doDelete6 = doDelete6;
   			vm.doAdd6 = doAdd6;
   			vm.init6 = init6;
   			vm.onReset = onReset;
   			vm.showDetails6 = showDetails6;
   			vm.searchPage6 = searchPage6;
   			vm.onSubmit6 = onSubmit6;
 
   			init6();
   			
   			function init6() {
				vm.data = angular.copy(UtilityFactory.getFamily());
	    		vm.data.ownerID = vm.params.curUserID;
				vm.data.ownerID = vm.params.curUserID;
				vm.data.mainID = vm.params.curPersonID;
	   			
				if(vm.params.debug) {
					vm.data.ownerName = "John Q. Public";
					vm.data.ownerID = 1;
					vm.data.nEditors = 3;
		   			vm.data.editors = [{mainID:6121, fullName:'Hazel Johnson'}, {mainID:6122, fullName:'Sarah Johnson'}, {mainID:6123, fullName:'Angela Johnson'}];																// NOTE: need to make this live
				} else {
// Note: make it real for production					
				}
				
	   			vm.data.inuse = (vm.data.ownerID!=vm.data.mainID || vm.data.nEditors>0);
				if(vm.data.which==0) {
		   			vm.data.body = vm.params.curUserName + ' has updated information about ' + vm.data.fullName;				
			    	vm.data.subject = 'Change Made to ' + vm.data.fullName;
				} else {
		   			vm.data.body = vm.params.curUserName + ' has updated information about ' + vm.data.fullName;				
			    	vm.data.subject = 'Change Made to ' + vm.data.fullName;
				}
   			}

   			function doChange6() {
   				
   			}
 		
			function doDelete6() {
				$scope.showConfirm();
/*				editService.deleteEvents(vm.data.details.id)
	           	.then(function successCallback(response) {
	  				if (response.status=='200') {
						vm.onReset4();
						return;
					} else {
					}	
	           	});
*/
			}

			function doAdd6() {

			}

   			function onReset() {
				vm.data = {};
				init6();
			}

   			function showDetails6(who) {  
 	        	$state.go('sheet', {obj:{name:'editFamily', tab:vm.tab, whoID:who}});
	      	}

   			function searchPage6(who,what) {  
	        	$state.go('search', {obj:{name:'editFamily', search:vm.data.surname, tab:vm.tab, what:what, who:who}});
	      	}
 	      	
	      	//still need to finish submit
	      	
   			function onSubmit6() {
				EditService.updateFamily(vm.data)
	           	.then(function successCallback(response) {
	  				if (response.status=='200') {
		  				UtilityFactory.showTemplateToast('<md-toast>The ' + vm.data.selectedType.label + ' event for ' + vm.data.fullName + ' has been added to ' + vm.params.appName + '.</md-toast>');
	  					onReset6();

	  				} else {
	  					var err = response.data;
		  				err = err.substring(7,err.length);
		  				UtilityFactory.showAlertToast('<md-toast>' + err + '. Please reenter.</md-toast>');
						onReset6();	  					
					}	
	           	});
			}
			
			$scope.showConfirm = function() {
			    var confirm = $mdDialog.confirm()
			          .title('Are You Sure You Want to Remove ' + $scope.data.selectedType.label + ' From the Family?')
			          .textContent('The person will be permamently removed from the family and this can not be undone.')
			          .ariaLabel('Delete Relationship')
			          .ok('OK')
			          .cancel('Cancel');

			    $mdDialog.show(confirm).then(function() {
	  				UtilityFactory.showTemplateToast('<md-toast>' + $scope.data.selectedType.label + ' has been removed from the family of ' + vm.data.fullName + '.</md-toast>');
			    }, function() {
	  				UtilityFactory.showTemplateToast('<md-toast>The deletion has been canceled.</md-toast>');
			    });
			};
	  }	

})();