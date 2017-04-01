/* ******************************************************

 Event Controller

  ToDo:
  
  make spouses array real for current person
  in php or jquery, prevent duplicate events where they don't make sense
  add more subsheet off top of main sheet
  add note subsheet off top of main sheet

 ******************************************************
*/

(function () {    'use strict';

    angular
		.module('root')
        .controller('EditMarriageController', EditMarriageController)
    
    	.config(function() {	  		
		});
		
    EditMarriageController.$inject = [ '$scope', '$rootScope', '$state', '$mdDialog', '$filter', 'UtilityFactory', 'EditService', 'KfamilyEvStruct','KdateModifiers', 'Gparams'];
   		function EditMarriageController($scope,   $rootScope,   $state,   $mdDialog,   $filter,   UtilityFactory,   EditService,   KfamilyEvStruct,  KdateModifiers,   Gparams) {
 			var vm = this;
 			
 			var theType;
 			var spouse = {};
 			var otherOwner = {};
 			var tmp;
 			var results = [];
			vm.data = {};
			vm.data.ownerID = 0;
   			$scope.data = {};
   			
   			vm.doChange = vm.doChange;														//prototype function declaration so can be callled before defined
 						
  			vm.params = Gparams;
     		vm.typeList = KfamilyEvStruct;
			vm.modList = KdateModifiers;
			vm.whichLabel = 'Marriage';
			vm.tab = 3;

 			vm.doChange3 = doChange3;														//prototype function declaration so can be callled before defined
   			vm.doDelete3 = doDelete3;
   			vm.doAdd3 = doAdd3;
  			vm.init3 = init3;
   			vm.onReset = onReset;
   			vm.showDetails3 = showDetails3;
   			vm.searchPage3 = searchPage3;
   			vm.onSubmit3 = onSubmit3;
 
   			init3();
   			
   			function init3() {
				vm.data = angular.copy(UtilityFactory.getFamily());
		 		vm.data.spouse = vm.data.spouses[vm.data.curSpouse];	   			
		 		vm.data.details = $filter('filter')(vm.data.attributes, {mainType:'FAMI'}, true)[0];
		 		vm.data.details.date1 = new Date(vm.data.details.date1);
		 		vm.data.details.date2 = new Date(vm.data.details.date2);
	
		 		$scope.data.selectedType = $filter('filter')(vm.typeList, {value:vm.data.details.theType}, true)[0];				// set to first event to start
		 		$scope.data.dateModifier = $filter('filter')(vm.modList, {value:vm.data.details.dateModifier}, true)[0];
	   			
		 		if(vm.data.details.length===0) {																					// no events to update or no spouses (means no events), so set data to {} and set selects to defaults
				   	vm.setNone();
					vm.data.selectedType = vm.typeList[5];
					vm.data.dateModifier = vm.modList[0];
					return;
		 		}
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
			
// NOTE: need to deal with multiple events of same type
// NOTE: what about multiple mothers/fathers?
						
			function doChange3() {
		 		vm.data.details = $filter('filter')(vm.data.attributes, {theType:$scope.data.selectedType.value}, true)[0];					//need to deal with multiple same event
		 		vm.data.details.date1 = new Date(vm.data.details.date1);
		 		vm.data.details.date2 = new Date(vm.data.details.date2);

		 		$scope.data.dateModifier = $filter('filter')(vm.modList, {value:vm.data.details.dateModifier}, true)[0];

			}

			function doDelete3() {
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

			function doAdd3() {
		 		vm.data.details = {};				
				vm.data.dateModifier = vm.modList[0];

			}

   			function onReset() {
				vm.data = {};
				vm.init3();  	
  			}
 
   			vm.disableSpouse = function(who) {
   				if (vm.data.curSpouse == who) return true;
   				return false;
   			};
   			
   			vm.changeSpouse = function(who) {
   				vm.data.curSpouse = who;
		 		vm.data.spouse = vm.data.spouses[vm.data.curSpouse];	   			
   			};
   			
   			function showDetails3(who) {  
	        	$state.go('sheet', {obj:{name:'editMarriages', tab:vm.tab, whoID:who}});
	      	}

   			function searchPage3(who,what) {  
	        	$state.go('search', {obj:{name:'editMarraiges', search:vm.data.surname, tab:vm.tab, what:what, who:who}});
	      	}
 

	      	function onSubmit3() {
	      		vm.data.userID = params.curUserID;
	      		vm.data.theType = vm.data.selectedType.value;
	      		vm.data.dateModifier = vm.data.dateModifier.value;
				EditService.updateAttributes(vm.data)
	           	.then(function successCallback(response) {
	  				if (response.status=='200') {
		  				UtilityFactory.showTemplateToast('<md-toast>The ' + vm.data.selectedType.label + ' event for ' + vm.data.fullName + ' has been added to ' + vm.params.appName + '.</md-toast>');
	  					vm.onReset();

	  				} else {
	  					var err = response.data;
		  				err = err.substring(7,err.length);
		  				UtilityFactory.showAlertToast('<md-toast>' + err + '. Please reenter.</md-toast>');
						vm.onReset();	  					
					}	
	           	});
			}
	      	
			$scope.showConfirm = function() {
			    var confirm = $mdDialog.confirm()
			          .title('Are You Sure You Want to Delete this ' + $scope.data.selectedType.label + '?')
			          .textContent('The data will be permamently deleted and this can not be undone.')
			          .ariaLabel('Delete Item')
			          .ok('OK')
			          .cancel('Cancel');

			    $mdDialog.show(confirm).then(function() {
	  				UtilityFactory.showTemplateToast('<md-toast>The ' + $scope.data.selectedType.label + ' for ' + vm.data.fullName + ' has been deleted from.</md-toast>');
			    }, function() {
	  				UtilityFactory.showTemplateToast('<md-toast>The deletion has been canceled.</md-toast>');
			    });
			};
	  }	
})();	