/* ******************************************************

 Event Controller

 ToDo: add search to list of fathers & mothers select
 ToDo: hide/show areas for appropriate events
 ToDo: add more sub-sheet off top of main sheet
 ToDo: add note sub-sheet off top of main sheet

 ******************************************************
*/

(function () {    'use strict';

    angular // jshint ignore:line
		.module('root')
        .controller('EditEventController', EditEventController)

    	.config(function() {
		});

    EditEventController.$inject = [ '$scope', '$state', '$filter', '$mdDialog', 'UtilityFactory', 'EditService', 'KindiEvStruct','KdateModifiers', 'Gparams'];
   		function EditEventController($scope,  $state,    $filter,    $mdDialog,   UtilityFactory,   EditService,   KindiEvStruct,  KdateModifiers,   Gparams) {
 			var vm = this;


   			$scope.data = {};

			vm.data = {};
			vm.data.ownerID = 0;
   			vm.params = Gparams;
     		vm.typeList = KindiEvStruct;
			vm.modList = KdateModifiers;
			vm.whichLabel = 'Event';
			vm.tab = 1;

  			vm.doChange1 = doChange1;				//prototype function declaration so can be called before defined
   			vm.doDelete1 = doDelete1;
   			vm.doAdd1 = doAdd1;
   			vm.init1 = init1;
   			vm.onReset = onReset;
   			vm.showDetails1 = showDetails1;
   			vm.searchPage1 = searchPage1;
   			vm.onSubmit1 = onSubmit1;

			init1();

   			function init1() {
   			    vm.data = null;
   			    vm.data.father = null;
   			    vm.data.mother = null;
   			    vm.data.fathers = null;
   			    vm.data.mothers = null;

   				vm.data = angular.copy(UtilityFactory.getFamily()); // jshint ignore:line
 		 		vm.data.father = vm.data.fathers[vm.data.curFather];
		 		vm.data.mother = vm.data.mothers[vm.data.curMother];
		 		vm.data.details = $filter('filter')(vm.data.attributes, {mainType:'EVEN'}, true)[0];
		 		vm.data.details.date1 = new Date(vm.data.details.date1);
		 		vm.data.details.date2 = new Date(vm.data.details.date2);

// set to first event to start
		 		$scope.data.selectedType = $filter('filter')(vm.typeList, {value:vm.data.details.theType}, true)[0];
		 		$scope.data.dateModifier = $filter('filter')(vm.modList, {value:vm.data.details.dateModifier}, true)[0];

// no events to update or no spouses (means no events), so set data to {} and set selects to defaults
		 		if(vm.data.details.length===0) {
					vm.data.selectedType = vm.typeList[5];
					vm.data.dateModifier = vm.modList[0];

	 	   		}
			}

// NOTE: need to deal with multiple events of same type
// NOTE: what about multiple mothers/fathers?

			function doChange1() {
//   			    ToDo: need to deal with multiple same event
		 		vm.data.details = $filter('filter')(vm.data.attributes, {theType:$scope.data.selectedType.value}, true)[0];
		 		vm.data.details.date1 = new Date(vm.data.details.date1);
		 		vm.data.details.date2 = new Date(vm.data.details.date2);

		 		$scope.data.dateModifier = $filter('filter')(vm.modList, {value:vm.data.details.dateModifier}, true)[0];

			}

			function doDelete1() {
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

			function doAdd1() {
		 		vm.data.details = {};
				vm.data.dateModifier = vm.modList[0];

			}

			function onReset() {
				vm.data = {};
				vm.init1();
   			}

			function showDetails1(who) {
	        	$state.go('sheet', {obj:{name:'editEvents', tab:vm.tab, whoID:who}});
	      	}

			function searchPage1(who, what) {
	        	$state.go('search', {obj:{name:'editEvents', search:vm.data.surname, tab:vm.tab, what:what, who:who}});
	      	}

			function onSubmit1() {
	      		vm.data.theType = vm.data.selectedType.value;
	      		vm.data.dateModifier = vm.data.dateModifier.value;
				EditService.updateEvent(vm.data)
	           	.then(function successCallback(response) {
	  				if (response.status===200) {
		  				UtilityFactory.showTemplateToast('<md-toast>The ' + vm.data.selectedType.label + ' event for ' + vm.data.fullName +
                            ' has been added to ' + vm.params.appName + '.</md-toast>');
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
                var confirm;
                //noinspection JSUnresolvedFunction
                confirm = $mdDialog.confirm()
                    .title('Are You Sure You Want to Delete this ' + $scope.data.selectedType.label + ' Event?')
                    .textContent('The data will be permanently deleted and this can not be undone.')
                    .ariaLabel('Delete Item')
                    .ok('OK')
                    .cancel('Cancel');

			    $mdDialog.show(confirm).then(function() {
	  				UtilityFactory.showTemplateToast('<md-toast>The ' + $scope.data.selectedType.label + ' event for ' + vm.data.fullName +
                        ' has been deleted from ' + vm.params.appName + '.</md-toast>');
			    }, function() {
	  				UtilityFactory.showTemplateToast('<md-toast>The deletion has been canceled.</md-toast>');
			    });
			};
	  }
})();