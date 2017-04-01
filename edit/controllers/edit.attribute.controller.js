/* ******************************************************

 Attribute Controller

  ToDo:
  
  prevent duplicate attributes where they don't make sense
  hide/show areas for appropriate attributes
  disable clear button after form submisstion since form is empty at that point
  
 ******************************************************
*/

(function () {    'use strict';

    angular
		.module('root')
        .controller('EditAttributeController', EditAttributeController)
    
    	.config(function() {	  		
		});
		
    EditAttributeController.$inject = [ '$scope', '$filter', '$state', '$mdDialog', 'UtilityFactory', 'EditFactory', 'EditService', 'KindiAttrStruct','KdateModifiers', 'Gparams'];
		function EditAttributeController($scope,   $filter,   $state,   $mdDialog,   UtilityFactory,   EditFactory,   EditService,   KindiAttrStruct,  KdateModifiers,   Gparams) {
 			var vm = this;
 			
 			var theType;
 			var theResult = [];
			vm.data = {};
			vm.data.ownerID = 0;
  			$scope.data = {};
   			
  			vm.params = Gparams;
     		vm.typeList = KindiAttrStruct;
			vm.modList = KdateModifiers;
			vm.whichLabel = 'Attribute';
			vm.tab = 2;
  			vm.titles = ['Name', 'Events', 'Attributes', 'Marriages', 'Stories', 'Media', 'Family'];
			vm.data.title = vm.titles[vm.tab];
 
   			vm.doChange2 = doChange2;														//prototype function declaration so can be callled before defined
   			vm.doDelete2 = doDelete2;
   			vm.doAdd2 = doAdd2;
   			vm.init2 = init2;
   			vm.onReset = onReset;
   			vm.showDetails2 = showDetails2;
   			vm.searchPage2 = searchPage2;
   			vm.onSubmit2 = onSubmit2;
			
			init2();

			function init2() {
				vm.data = angular.copy(UtilityFactory.getFamily());
		 		vm.data.details = $filter('filter')(vm.data.attributes, {mainType:'ATTR'}, true)[0];
		 		vm.data.details.date1 = new Date(vm.data.details.date1);
		 		vm.data.details.date2 = new Date(vm.data.details.date2);
	
		 		$scope.data.selectedType = $filter('filter')(vm.typeList, {value:vm.data.details.theType}, true)[0];				// set to first event to start
		 		$scope.data.dateModifier = $filter('filter')(vm.modList, {value:vm.data.details.dateModifier}, true)[0];
	   			
		 		if(vm.data.details.length===0) {																					// no events to update or no spouses (means no events), so set data to {} and set selects to defaults
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
						
			function doChange2() {
		 		vm.data.details = $filter('filter')(vm.data.attributes, {theType:$scope.data.selectedType.value}, true)[0];					//need to deal with multiple same event
		 		vm.data.details.date1 = new Date(vm.data.details.date1);
		 		vm.data.details.date2 = new Date(vm.data.details.date2);

		 		$scope.data.dateModifier = $filter('filter')(vm.modList, {value:vm.data.details.dateModifier}, true)[0];

			}

			function doDelete2() {
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

			function doAdd2() {
		 		vm.data.details = {};				
				vm.data.dateModifier = vm.modList[0];

			}

			function onReset() {
				vm.data = {};
				vm.init2(); 

  			}
 	      	
  			function showDetails2(who) {  
	        	$state.go('sheet', {obj:{name:'editAttributes', tab:vm.tab, whoID:who}});
	      	}

	      	function searchPage2(who, what) {  
	        	$state.go('search', {obj:{name:'editAttributes', search:vm.data.surname, tab:vm.tab, what:what, who:who}});
	      	}

	      	function onSubmit2() {
	      		vm.data.theType = vm.data.selectedType.value;
	      		vm.data.dateModifier = vm.data.dateModifier.value;
				EditService.updateAttributes(vm.data)
	           	.then(function successCallback(response) {
	  				if (response.status=='200') {
		  				UtilityFactory.showTemplateToast('<md-toast>The ' + vm.data.selectedType.label + ' event for ' + vm.data.fullName + ' has been added to ' + vm.params.appName + '.</md-toast>');
	  					vm.onReset2();

	  				} else {
	  					var err = response.data;
		  				err = err.substring(7,err.length);
		  				UtilityFactory.showAlertToast('<md-toast>' + err + '. Please reenter.</md-toast>');
						vm.onReset2();	  					
					}	
	           	});
			}
			
			$scope.showConfirm = function() {
			    var confirm = $mdDialog.confirm()
			          .title('Are You Sure You Want to Delete this ' + $scope.data.selectedType.label + ' Attribute?')
			          .textContent('The data will be permamently deleted and this can not be undone.')
			          .ariaLabel('Delete Item')
			          .ok('OK')
			          .cancel('Cancel');

			    $mdDialog.show(confirm).then(function() {
	  				UtilityFactory.showTemplateToast('<md-toast>The ' + $scope.data.selectedType.label + ' attribute for ' + vm.data.fullName + ' has been deleted.</md-toast>');
			    }, function() {
	  				UtilityFactory.showTemplateToast('<md-toast>The deletion has been canceled.</md-toast>');
			    });
			};
	  }	
})();	