/* ******************************************************

 Event Controller

  ToDo:
  
  filter createdList for current person and others that have been selected
  add search to list of fathers & mothers select
  add unused createdList perople to fathers & mothers select
  put birth and death in main DB also (in php)
  When had collision, prefill forms with that persons data
  in php or jquery, prevent duplicate events where they don't make sense
  hide/show areas for appropriate events
  add more subsheet off top of main sheet
  add note subsheet off top of main sheet

 ******************************************************
*/

(function () {    'use strict';

    angular
		.module('root')
        .controller('AddEventController', AddEventController)

    	.config(function() {	  		
		});
		
    AddEventController.$inject = [ '$scope', '$filter', '$state', 'UtilityFactory', 'AddFactory', 'AddService', 'KindiEvStruct','KdateModifiers', 'Gparams'];
   		function AddEventController($scope,   $filter,   $state,   UtilityFactory,   AddFactory,   AddService,   KindiEvStruct,  KdateModifiers,   Gparams) {
 
// initialization
   			
  			var vm = this;

   			vm.data = {};
 			
  			vm.params = Gparams;
     		vm.typeList = KindiEvStruct;
			vm.modList = KdateModifiers;
			vm.whichLabel = 'Event';
			vm.tab = 1;
	 		vm.createdList = AddFactory.getCreatedList();	
			$scope.rs.addSelectedTab = 1;
			
  			vm.data.selectedType = vm.typeList[0]; 
			vm.data.dateModifier = vm.modList[0];   	
 			vm.data.ownerID = vm.params.curUserID;
	 		vm.person = AddFactory.getCurPerson();
			try {
	   			vm.data.mainID = vm.person.mainID;
	   			vm.data.fullName = vm.person.fullName;
			} catch(err) {
	   			vm.data.mainID = -1;
	   			vm.data.fullName = 'James Wilson Johnson';
			}
			vm.data.father = "None";
			vm.data.mother = "None";
			vm.data.fatherID = 0;
			vm.data.motherID = 0;
   			$('#curUser').text(vm.data.fullName);
	 		try {
		 		if(angular.isDefined(vm.data.date1)) $filter('date')(vm.data.date1.getTime(), 'mm/dd/yyyy');
		 		if(angular.isDefined(vm.data.date2)) $filter('date')(vm.data.date2.getTime(), 'mm/dd/yyyy');
	 		} catch(err) {}
				 		
	 		vm.setTag0 = function() {
	 			$("#curUser1").text("Drop tag to change Person");
	 			$("#curUser1").css("border", "thin dashed gray");
	 			$("#curUser1").css("color", "blue");
	 			$("#curUser1").css("padding", "5px");
	 			$("#curUser1a").text("Drop tag to set Father");
	 			$("#curUser1a").css("border", "thin dashed gray");
	 			$("#curUser1a").css("color", "blue");
	 			$("#curUser1a").css("padding", "5px");
	 			$("#curUser1b").text("Drop tag to set Mother");
	 			$("#curUser1b").css("border", "thin dashed gray");
	 			$("#curUser1b").css("color", "blue");
	 			$("#curUser1b").css("padding", "5px");
	 		};
	 		
	 		vm.clearTag0 = function() {
	 			$("#curUser1").css("border", "none");
	 			$("#curUser1").css("color", "black");
	 			$("#curUser1").css("padding", "0px");
	   			$('#curUser1').text(vm.data.fullName);
	 			$("#curUser1a").css("border", "none");
	 			$("#curUser1a").css("color", "black");
	 			$("#curUser1a").css("padding", "0px");
	   			$('#curUser1a').text(vm.data.father);
	 			$("#curUser1b").css("border", "none");
	 			$("#curUser1b").css("color", "black");
	 			$("#curUser1b").css("padding", "0px");
	   			$('#curUser1b').text(vm.data.mother);
	 		};

	 		$scope.nameDrop1 = function(newID, theName) {
				Gparams.curPersonID = newID;
				AddFactory.setCurPerson({mainID:newID,fullName:theName});
				vm.data.fullName = theName;
				vm.data.mainID = newID;
   			};
  			
	 		$scope.nameDrop1a = function(newID, theName) {
	 			vm.data.father = theName;
				vm.data.fatherID = newID;
   			};
 
	 		$scope.nameDrop1b = function(newID, theName) {
	 			vm.data.mother = theName;
				vm.data.motherID = newID;
    			};
 
   			vm.onReset = function() {
   				vm.data = {};
 	  			vm.data.selectedType = vm.typeList[0]; 
 				vm.data.dateModifier = vm.modList[0];   	
 				vm.data.father = "None";
 				vm.data.mother = "None";
 				vm.data.fatherID = 0;
 				vm.data.motherID = 0;
   			};
 	      	
	      	vm.showDetails1 = function(which) {  
	        	$state.go('sheet', {name:'addEvents', tab:vm.tab});

	      	};

	      	vm.searchPage = function(which) {  
	        	$state.go('search', {obj:{name:'addEvents', tab:vm.tab, search:vm.data.surname}});

	      	};

	      	vm.onSubmit1 = function() {
	      		vm.data.theType = vm.data.selectedType.value;
	      		vm.data.dateModifier = vm.data.dateModifier.value;
				AddService.addEvent(vm.data)
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
	           	})
			};
	  }
})();
