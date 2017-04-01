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
        .controller('AddMediaController', AddMediaController)
    
    	.config(function() { });
		
    AddMediaController.$inject = [ '$scope', '$state', 'AddService', '$filter', 'Gparams', 'UtilityFactory', 'NgTableParams'];
   		function AddMediaController($scope,   $state,   AddService,   $filter,   Gparams,   UtilityFactory,   NgTableParams) {
   
   			var vm = this;

			vm.data = {};
 			vm.params = Gparams;
			vm.setFocus = true;
			vm.tab = 5;
	 		vm.createdList = AddService.getCreatedList();	
			$scope.rs.AddSelectedTab = 5;
 
 			vm.data.ownerID = vm.params.curUserID;
 			vm.data.theType = 'file';
  			
 			vm.data.ownerID = vm.params.curUserID;
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
		
 			vm.startOver = function() {
				vm.setFocus2 = false;
				vm.setFocus1 = true;
				vm.clearAll();
			};
 			
	    	var mediaDropFile = new Dropzone("div#uploadProfile5", {
				url						: "/add/php/userFileUpload.php",
				method					: "POST",
				paramName				: "file",
				clickable				: true,
  				maxFilesize				: 5,
				uploadMultiple			: false,
				parallelUploads			: 1,
				createImageThumbnails	: false,
				renameFilename			: function (name) {return vm.data.ownerID + '.' + name.substr(name.lastIndexOf('.')+1);},
				autoProcessQueue		: false,
				previewTemplate			: document.getElementById('preview-template').innerHTML
			});	  

	    	mediaDropFile.on("success", function(files, response) {
		    	vm.data.theFile = response.substring(9,response.length-5);
				AddService.addMedia(vm.data)
	           	.then(function successCallback(response) {
	  				if (response.status=='200') {
						UtilityFactory.showTemplateToast('<md-toast>' + vm.data.theFile + ' was successfully added to ' + vm.params.appName + '.</md-toast>');
						$(".dropzoneFormat").text('Drop a photo, video, or audio file about ' + vm.data.fullName + ' here');
						vm.onReset();

					} else {
						var err = response.data;
						$(".dropzoneFormat").text('Drop a photo, video, or audio file about ' + vm.data.fullName + ' here');
						err = err.substring(7,err.length-1);
		  				UtilityFactory.showAlertToast('<md-toast> ' + err + '. Please reenter.</md-toast>');
					}	
	           	});
	    		$('.dz-complete').remove();
				UtilityFactory.showTemplateToast('<md-toast>The file was successfully added to ' + vm.params.appName + '.</md-toast>');
		    });
		    mediaDropFile.on("drop", function(files, response) {
		    	$(".dropzoneFormat").text('A file is staged for upload.');
		    });	 			

	      	vm.showDetails5 = function(which) {  				
	      		$state.go('sheet');

	      	};

  			vm.onReset = function() {
   				vm.data.theTitle = "";
   			};

	 		$scope.nameDrop5 = function(newID, theName) {
				Gparams.curPersonID = newID;
				vm.data.fullName = theName;
				vm.data.mainID = newID;
				$(".dropzoneFormat").text('Drop a photo, video, or audio file about ' + vm.data.fullName + ' here');
   			};
			
	 		vm.setTag5 = function() {
	 			$("#curUser5").text("Drop tag to change Person");
	 			$("#curUser5").css("border", "thin dashed gray");
	 			$("#curUser5").css("color", "blue");
	 			$("#curUser5").css("padding", "5px");
	 		};
	 		
	 		vm.clearTag5 = function() {
	 			$("#curUser5").css("border", "none");
	 			$("#curUser5").css("color", "black");
	 			$("#curUser5").css("padding", "0px");
	   			$('#curUser5').text(vm.data.fullName);
	 		};
			
	 		vm.onSubmit5 = function() {
	 			mediaDropFile.processQueue();	
	 		};
	 		
			vm.clearAll = function() {
				vm.data = {};
	      		SearchFactory.setSearchTerm('');
	      		SearchFactory.setReturn(false);											// turn on return button on sheet page
				SearchFactory.setFromPage('');
				SearchFactory.setFromTab(0);
				SearchFactory.setStep(false);
			};
   		   		
   	}
})();