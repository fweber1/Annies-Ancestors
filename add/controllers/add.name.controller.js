/* ******************************************************

 Add Name Controller

  ToDo:
  
  add more subsheet off top of sheet
  add note subsheet off top of sheet
  move duplicate sheet to top of card to prevent collision with footer

 ******************************************************
*/

(function () {    'use strict';

    angular
		.module('root')
        .controller('AddNameController', AddNameController)
  
    	.config(function() { });
		
    AddNameController.$inject = [ '$scope', '$rootScope', '$state', '$stateParams', '$timeout', '$mdDialog', 'AddService', 'AddFactory', 'SearchFactory', 'SheetService', '$filter', 'Gparams', 'UtilityFactory', 'NgTableParams'];
   		function AddNameController($scope,   $rootScope,   $state,   $stateParams,   $timeout,   $mdDialog,   AddService,   AddFactory,   SearchFactory,   SheetService,   $filter,   Gparams,   UtilityFactory,   NgTableParams) {
  
 // initialization code 
   			
   			var vm = this;
			var nameDropzone;
			var addUser = {};
 			var nHits;
 			  
			vm.data = {};
			vm.values = [];
			vm.createdList = {};
			vm.params = Gparams;
			vm.havePerson = false;
			vm.selectedRow = -1;	
   			vm.tab = 0;
			vm.data.ownerID = vm.params.curUserID;
 			vm.createdList = AddFactory.getCreatedList();

			vm.tabs = ['addName', 'addEvents', 'addAttributes', 'addMarriages', 'addStories', 'addMedia', 'addFamily'];
	 		
 			try {
	 			vm.tab = $stateParams.obj.tab;
				$rootScope.rs.addSelectedTab = theTab;
				$state.go(vm.tabs[theTab]);
			} catch(err) {
				$rootScope.rs.addSelectedTab = 0;
			}

 	    	vm.tableParams = new NgTableParams({ 
	 			page	: 1,
	     		count	: 10
	     		},{
	   			getData : function(params) {
	     			if(!angular.isDefined(vm.values)) return;	
	     			var results = vm.values;	
	 	   			var filteredData = vm.tableParams.filter() ? $filter('filter')(results, vm.tableParams.filter()) : results;
					var sortedData = vm.tableParams.sorting() ? $filter('orderBy')(filteredData, vm.tableParams.orderBy()) : filteredData;
					vm.tableParams.total(UtilityFactory.getLength(sortedData));
					vm.tableData = sortedData;
					vm.tableData = vm.tableData.slice((vm.tableParams.page()-1)*vm.tableParams.count(), vm.tableParams.page() * vm.tableParams.count());
					return vm.tableData;
				}}
			);	
	    	
	    	nameDropzone = new Dropzone("div#uploadProfile0", {
				url						: "/add/php/uploadProfile.php",
				method					: "POST",
				paramName				: "file",
				clickable				: true,
  				maxFilesize				: 5,
				uploadMultiple			: false,
				parallelUploads			: 1,
				createImageThumbnails	: false,
				renameFilename			: function (name) {return vm.mainID + '.' + name.substr(name.lastIndexOf('.')+1);},
				autoProcessQueue		: true,
				acceptedFiles			: '.jpeg, .jpg, .gif, .png',		
				previewTemplate			: document.getElementById('preview-template').innerHTML
			});
    	
	    	nameDropzone.on("success", function(files, response) {
	    	vm.havePerson = false;
	    	vm.onReset();
			UtilityFactory.showTemplateToast('<md-toast>The profile photo for ' + vm.fullName+ ' was successfully added to ' + vm.params.appName + '.</md-toast>');
			});			

// functions
	    	
			vm.showDuplicates = function() {
		        $mdDialog.show({
			          clickOutsideToClose: true,
			          scope: $scope,
			          preserveScope: true,
			          contentElement: '#nameDLOG',
			          openFrom: $('#toastLocation'),
			          closeTo: $('#toastLocation'),
			          onComplete: afterShowAnimation,
		        });

		        function afterShowAnimation(scope, element, options) {
		           // post-show code here: DOM element focus, etc.
		        }		
		    };
	    
		    vm.closeDialog = function() {
		    	$mdDialog.hide();
		     };

			vm.setSelected = function (selectedRow) {
			   vm.selectedRow = selectedRow;
			};	
	    	      	
	      	vm.showDetails0 = function(which) {  				
	        	$state.go('sheet', {tab:vm.tab});

	      	};

  			vm.onReset = function() {
   				vm.data = {};
   				vm.data.ownerID = vm.params.curUserID;
   			};

			vm.onSubmit0 = function() {
				if(vm.data.gender) {vm.data.gender = "M";} else {vm.data.gender = "F";}
				AddService.checkName(vm.data)
	           	.then(function successCallback(response) {
	  				if (response.status=='200') {
		  				vm.mainID = response.data.split('\n')[1];
	 					Gparams.curPersonID = vm.mainID;
						if(!angular.isDefined(vm.data.namePrefix)) vm.data.namePrefix = '';
						if(!angular.isDefined(vm.data.givenName)) vm.data.givenName = '';
						if(!angular.isDefined(vm.data.middleName)) vm.data.middleName = '';
						if(!angular.isDefined(vm.data.nameSuffix)) vm.data.nameSuffix = '';
						vm.fullName = vm.data.namePrefix + ' ' + vm.data.givenName + ' ' + vm.data.middleName + ' ' + vm.data.surname + ' ' + vm.data.nameSuffix;
						UtilityFactory.showTemplateToast('<md-toast>' + vm.fullName+ ' was successfully added to ' + vm.params.appName + '.</md-toast>');
						try {
							vm.createdList.push({mainID:vm.mainID, fullName:vm.fullName});
						} catch(err) {
							vm.createdList = {mainID:vm.mainID, fullName:vm.fullName};
						}
						vm.person = {mainID:vm.mainID, fullName:vm.fullName};
						AddService.setCreatedList(vm.createdList);
						AddService.setCurPerson(vm.person);
						vm.havePerson = true;

	  				} else if(response.status=='303') {
	  					var err = response.data;
		  				err = err.substring(7,err.length);
		  				UtilityFactory.showAlertToast('<md-toast>' + err + '. Please reenter.</md-toast>');
						vm.onReset();	  					
					} else {
						vm.showDuplicates();
						vm.nHits = response.data.nHits;
						vm.values = response.data.value;
						vm.tableParams.reload();
					}	
	           	});
			};
			
			vm.haveMatch = function() {
				vm.trayOpen = false;
				vm.value = {};
				vm.data = {};
				var fullName = vm.tableData[vm.selectedRow].fullName;
				var id = vm.tableData[vm.selectedRow].mainID;
  				UtilityFactory.showTemplateToast('<md-toast>Congratulations, you have connected with another family branch!</md-toast>');
				vm.createdList.push({mainID:vm.id, fullName:fullName});
				AddService.setCreatedList(vm.createdList);
				AddService.setCurPerson({mainID:vm.mainID, fullName:vm.fullName});
				vm.closeDialog();
				onReset();
			};
			
			vm.create = function() {
				AddService.addName(vm.data)
	           	.then(function successCallback(response) {
	  				if (response.status=='200') {
	  					vm.trayOpen = false;
	 					Gparams.curPersonID = vm.mainID;
						if(!angular.isDefined(vm.data.namePrefix)) vm.data.namePrefix = '';
						if(!angular.isDefined(vm.data.givenName)) vm.data.givenName = '';
						if(!angular.isDefined(vm.data.middleName)) vm.data.middleName = '';
						if(!angular.isDefined(vm.data.nameSuffix)) vm.data.nameSuffix = '';
						vm.fullName = vm.data.namePrefix + ' ' + vm.data.givenName + ' ' + vm.data.middleName + ' ' + vm.data.surname + ' ' + vm.data.nameSuffix;
						UtilityFactory.showTemplateToast('<md-toast>' + vm.fullName+ ' was successfully added to ' + vm.params.appName + '.</md-toast>');
						vm.createdList.push({mainID:vm.mainID, fullName:vm.fullName});
						vm.person = {mainID:vm.mainID, fullName:vm.fullName};
						AddService.setCreatedList(vm.createdList);
						AddService.setCurPerson(vm.person);	 
						vm.closeDialog();
					} else {
		  				UtilityFactory.showAlertToast('<md-toast>Unable to add the new person. ' + vm.params.appName + ' have been notified.</md-toast>');
						vm.onReset();	  					
	  				}		
	           	});
			};
			
   	}
})();