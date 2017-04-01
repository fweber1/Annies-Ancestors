// ******************************************************
//
// Person Controller
//
// ******************************************************

(function () {    'use strict';

    angular
		.module('root')
        .controller('AddFamilyController', AddFamilyController)
    
    	.config(function() {	  		
		});
		
    AddFamilyController.$inject = [ '$scope', '$filter', '$state', 'AddService', 'Gparams'];
   		function AddFamilyController($scope,   $filter,   $state,   AddService,   Gparams) {
   
   		var vm = this;

		vm.data = {};
		vm.params = Gparams;
		vm.setFocus = true;
		vm.tab = 6;
 		vm.createdList = AddService.getCreatedList();	
		$scope.rs.addSelectedTab = 6;

		vm.data.ownerID = vm.params.curUserID;
		vm.data.theType = 'file';
 		vm.person = AddService.getCurPerson();
		try {
   			vm.data.mainID = vm.person.mainID;
   			vm.data.fullName = vm.person.fullName;
   			$('#curUser5').text(vm.person.fullName);
		} catch(err) {
   			vm.data.mainID = -1;
   			vm.data.fullName = 'James Wilson Johnson, III';
   			$('#curUser5').text('None');
		}
 		try {
	 		if(angular.isDefined(vm.data.date1)) $filter('date')(vm.data.date1.getTime(), 'mm/dd/yyyy');
	 		if(angular.isDefined(vm.data.date2)) $filter('date')(vm.data.date2.getTime(), 'mm/dd/yyyy');
 		} catch(err) {}

      	vm.showDetails6 = function(which) {  			
      		$state.go('sheet');

      	};

 		vm.setTag = function() {
 			$("#curUser6").css('color','blue');
 			$("#curUser6").text("Drop Tag Here to Set Relationship");
 			$("#curUser6").css("border", "thin dashed blue");
 			$("#target0").text("Drop the Tag Here to Link as a Spouse");
 			$("#target0").css('color','blue');
 			$("#target1").text("Drop the Tag Here to Link as a Father");
 			$("#target1").css('color','blue');
 			$("#target2").text("Drop the Tag Here to Link as a Mother");
 			$("#target2").css('color','blue');
 			$("#target3").text("Drop the Tag Here to Link as a Child");
 			$("#target3").css('color','blue');
 			$("#target4").text("Drop the Tag Here to Link as Other");
 			$("#target4").css('color','blue');
		};
 		
 		vm.clearTag = function() {
			$("#curUser6").css('color','#b7b7b7');
			$('#curUser6').text(vm.fullName);
 			$("#curUser6").css("border", "thin dashed gray");
			$("#target0").text("Drop Spouses Here");
			$("#target0").css('color','#b7b7b7');
			$("#target0").css('padding-top','15px');
			$("#target1").text("Drop Fathers Here");
			$("#target1").css('color','#b7b7b7');
			$("#target1").css('padding-top','15px');
			$("#target2").text("Drop Mothers Here");
			$("#target2").css('color','#b7b7b7');
			$("#target2").css('padding-top','15px');
			$("#target3").text("Drop Children Here");
			$("#target3").css('color','#b7b7b7');
			$("#target3").css('padding-top','15px');
			$("#target4").text("Drop Others Here");
			$("#target4").css('color','#b7b7b7');
			$("#target4").css('padding-top','15px');
		};

 		$scope.nameDrop6 = function(newID, theName) {
			Gparams.curPersonID = newID;
			vm.fullName = theName;
			vm.data.mainID = newID;
		};
  		     	
   		vm.peopleDrop = function(which) {
    	};
   	}
})();