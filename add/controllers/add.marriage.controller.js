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
        .controller('AddMarriageController', AddMarriageController)
    
    	.config(function() {	  		
		});
		
    AddMarriageController.$inject = [ '$scope', '$filter', '$state', 'UtilityFactory', 'AddFactory', 'AddService', 'KfamilyEvStruct','KdateModifiers', 'Gparams'];
   		function AddMarriageController($scope,   $filter,   $state,   UtilityFactory,   AddFactory,   AddService,   KfamilyEvStruct,  KdateModifiers,   Gparams) {
   
   			var vm = this;
 
  			vm.data = {};
   			vm.data.selectedType = {};
			vm.data.dateModifier = {};
  			vm.params = Gparams;
     		vm.typeList = KfamilyEvStruct;
			vm.modList = KdateModifiers;
			vm.whichLabel = 'Marriage';
			vm.tab = 3;
	 		vm.createdList = AddFactory.getCreatedList();	
			$scope.rs.addSelectedTab = 3;

			vm.data.spouse = "Unknown";
			vm.data.spouseID = -1;
  			vm.data.selectedType = vm.typeList[5]; 
			vm.data.dateModifier = vm.modList[0];   		
 			vm.data.ownerID = vm.params.curUserID;
	 		vm.person = AddFactory.getCurPerson();
	 		
			try {
	   			vm.data.mainID = vm.person.mainID;
	   			vm.data.fullName = vm.person.fullName;
			} catch(err) {
	   			vm.data.mainID = 6120;
	   			vm.data.fullName = 'James Wilson Johnson';
			}
   			$('#curUser3').text(vm.data.fullName);
 	 		try {
		 		if(angular.isDefined(vm.data.date1)) $filter('date')(vm.data.date1.getTime(), 'mm/dd/yyyy');
		 		if(angular.isDefined(vm.data.date2)) $filter('date')(vm.data.date2.getTime(), 'mm/dd/yyyy');
	 		} catch(err) {}
	 		
	 		vm.setTag3 = function() {
	 			$("#curUser3").text("Drop tag to change Person");
	 			$("#curUser3").css("border", "thin dashed gray");
	 			$("#curUser3").css("color", "blue");
	 			$("#curUser3").css("padding", "5px");
	 			$("#curUser3a").text("Drop tag to set Spouse");
	 			$("#curUser3a").css("border", "thin dashed gray");
	 			$("#curUser3a").css("color", "blue");
	 			$("#curUser3a").css("padding", "5px");
	 		};
	 		
	 		vm.clearTag3 = function() {
	 			$("#curUser3").text("Drop tag to change Person");
	 			$("#curUser3").css("border", "thin dashed gray");
	 			$("#curUser3").css("color", "blue");
	 			$("#curUsera").css("padding", "5px");
	 			$("#curUser3a").css("border", "none");
	 			$("#curUser3a").css("color", "black");
	 			$("#curUser3a").css("padding", "0px");
	   			$('#curUser3a').text(vm.data.spouse);
	 		};
	 		
	      	vm.searchPage = function(which) {  
	        	$state.go('search', {obj:{name:'addMarriages', tab:3, search:vm.person.surname}});

	      	};

	 		$scope.nameDrop3 = function(newID, theName) {
				Gparams.curPersonID = newID;
				AddFactory.setCurPerson({mainID:newID,fullName:theName});
				vm.data.fullName = theName;
				vm.data.mainID = newID;
   			};
  			
	 		$scope.nameDrop3a = function(newID, theName) {
				vm.data.spouse = theName;
				vm.data.spouseID = newID;
   			};
  			
  			vm.onReset = function() {
   				vm.data = {};
   	   			vm.data.selectedType = {value:'BIR', label:'Birth'}; 
   	   			vm.data.dateModifier = {value:'EXA', label:'Exact'};   		
				vm.data.spouse = 'Unknown';
				vm.data.spouseID = -1;
    		};
 	      	
	      	vm.showDetails3 = function(which) {  
	      		$state.go('sheet');

	      	};

	      	vm.onSubmit3 = function() {
	      		vm.data.theType = vm.data.selectedType.value;
	      		vm.data.dateModifier = vm.data.dateModifier.value;
				AddService.addMarriage(vm.data)
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
			};
	  }	
})();	