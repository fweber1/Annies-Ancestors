/* ******************************************************

 Attribute Controller

  ToDo:
  
  prevent duplicate attributes where they don't make sense
  hide/show areas for appropriate attributes
  php to add form contents
  disable clear button after form submisstion since form is empty at that point
  add more subsheet off top of main sheet
  add note subsheet off top of main sheet

 ******************************************************
*/

(function () {    'use strict';

    angular
		.module('root')
        .controller('AddAttributeController', AddAttributeController)
    
    	.config(function() {	  		
		});
		
    AddAttributeController.$inject = [ '$state', '$scope', '$filter', 'UtilityFactory', 'AddFactory', 'AddService', 'KindiAttrStruct','KdateModifiers', 'Gparams'];
		function AddAttributeController($state,   $scope,   $filter,   UtilityFactory,   AddFactory,   AddService,   KindiAttrStruct,  KdateModifiers,   Gparams) {

			var vm = this;
			
			vm.data = {};
  			vm.data.selectedType = {};
			vm.data.dateModifier = {};
			vm.data.mainID = -1;
 			vm.params = Gparams;
 			vm.typeList = KindiAttrStruct;
			vm.modList = KdateModifiers;
			vm.whichLabel = 'Attributes';
			vm.tab = 2;
	 		vm.createdList = AddFactory.getCreatedList();	
			$scope.rs.addSelectedTab = 2;
			
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
		   	$('#curUser2').text(vm.data.fullName);
	 		try {
		 		if(angular.isDefined(vm.data.date1)) $filter('date')(vm.data.date1.getTime(), 'mm/dd/yyyy');
		 		if(angular.isDefined(vm.data.date2)) $filter('date')(vm.data.date2.getTime(), 'mm/dd/yyyy');
	 		} catch(err) {}
						   			
	 		vm.setTag2 = function() {
	 			$("#curUser4").text("Drop tag to change Person");
	 			$("#curUser4").css("border", "thin dashed gray");
	 			$("#curUser4").css("color", "blue");
	 			$("#curUser4").css("padding", "5px");
	 		};
	 		
	 		vm.clearTag2 = function() {
	 			$("#curUser4").css("border", "none");
	 			$("#curUser4").css("color", "black");
	 			$("#curUser4").css("padding", "0px");
	   			$('#curUser4').text(vm.data.fullname);
	 		};

	 		$scope.nameDrop2 = function(newID, theName) {
				Gparams.curPersonID = newID;
				vm.data.fullname = theName;
				vm.data.mainID = newID;
   			};
   
			vm.onReset = function() {
				vm.data = {};
				vm.data.selectedType = {value:'DSCR', label:'Description'}; 
				vm.data.dateModifier = {value:'EXA', label:'Exact'};   		
			};
 	      	
	      	vm.showDetails2 = function(which) {  
	      		$state.go('sheet');

	      	};
	      	
	      	vm.searchPage = function(which) {  
	        	$state.go('search', {obj:{name:'addAttributes', tab:2, search:vm.person.surname}});

	      	};

			vm.onSubmit2 = function() {
				vm.data.theType = vm.data.selectedType.value;
				vm.data.dateModifier = vm.data.dateModifier.value;
				AddService.addAttribute(vm.data)
				.then(function successCallback(response) {
	  				if (response.status=='200') {
	  				UtilityFactory.showTemplateToast('<md-toast>The ' + vm.data.selectedType.label  + ' event for ' + vm.data.fullname + ' has been added to ' + vm.params.appName + '.</md-toast>');
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
