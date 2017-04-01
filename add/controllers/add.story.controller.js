// ******************************************************
//
// Person Controller
//
// ******************************************************

(function () {    'use strict';

    angular
		.module('root')
        .controller('AddStoryController', AddStoryController)
    
    	.config(function() {	  		
		});
		
    AddStoryController.$inject = ['$scope', '$timeout', '$rootScope', '$filter', '$location', '$state', 'UtilityFactory', 'SheetService', 'SearchFactory', 'AddService', 'KindiAttrStruct','KdateModifiers', 'Gparams'];
   		function AddStoryController($scope,  $timeout,   $rootScope,   $filter,   $location,   $state,   UtilityFactory,   SheetService,   SearchFactory,  AddService,   KindiAttrStruct,  KdateModifiers,   Gparams) {
   
   			var vm = this;
   			
	 		vm.createdList = AddService.getCreatedList();	
	 		vm.data = {};
   			vm.data.theContent = ''; 
   			vm.data.theType = 'text';
 			vm.params = Gparams;
			vm.tab = 4;
	 		vm.createdList = AddService.getCreatedList();	
			$scope.rs.selectedTab = 4;
 			
 			vm.data.ownerID = vm.params.curUserID;
	 		vm.person = AddService.getCurPerson();
			try {
	   			vm.data.mainID = vm.person.mainID;
	   			vm.data.fullName = vm.person.fullName;
	   			$('#curUser4').text(vm.person.fullName);
			} catch(err) {
	   			vm.data.mainID = -1;
	   			vm.data.fullName = 'James Wilson Johnson, III';
	   			$('#curUser4').text('None');
			}
	 		try {
		 		if(angular.isDefined(vm.data.date1)) $filter('date')(vm.data.date1.getTime(), 'mm/dd/yyyy');
		 		if(angular.isDefined(vm.data.date2)) $filter('date')(vm.data.date2.getTime(), 'mm/dd/yyyy');
	 		} catch(err) {}

			vm.onReset = function() {
   				vm.data.theContent = '';
   				vm.data.theTitle = '';
   			};

 			vm.onSubmit4 = function() {
				AddService.addStory(vm.data)
	           	.then(function successCallback(response) {
	  				if (response.status=='200') {
						UtilityFactory.showTemplateToast('<md-toast>The story was successfully added to ' + vm.params.appName + '.</md-toast>');
						vm.onReset();

					} else {
		  				UtilityFactory.showAlertToast('<md-toast>' + err + '. Please reenter.</md-toast>');
					}	
	           	})
			};

	      	vm.showDetails4 = function(which) {  				
	      		$state.go('sheet');

	      	};
  			
	 		vm.setTag4 = function() {
	 			$("#curUser4").text("Drop tag to change Person");
	 			$("#curUser4").css("border", "thin dashed gray");
	 			$("#curUser4").css("color", "blue");
	 			$("#curUser4").css("padding", "5px");
	 		};
	 		
	 		vm.clearTag4 = function() {
	 			$("#curUser4").css("border", "none");
	 			$("#curUser4").css("color", "black");
	 			$("#curUser4").css("padding", "0px");
	   			$('#curUser4').text(vm.data.fullName);
	 		};

	 		$scope.nameDrop4 = function(newID, theName) {
				Gparams.curPersonID = newID;
				vm.data.fullName = theName;
				vm.data.mainID = newID;
   			};
				
/*		   var events = ['trixInitialize', 'trixChange', 'trixSelectionChange', 'trixFocus', 'trixBlur', 'trixFileAccept'];

	   	    for (var i = 0; i < events.length; i++) {
	   	        $scope[events[i]] = function(e) {
	   	            document.getElementById(e.type).className = 'active';
	   	            $timeout(function() {
	   	                document.getElementById(e.type).className = '';
	   	            }, 500);
	   	        }
	   	    };

	   	    var createStorageKey, host, uploadAttachment;

   			
   			vm.trixInitialize = function(e, editor) {
   				
   			};
   			
   			vm.trixChange = function(e, editor) {
   				
   			};
   			
   			vm.trixSelectionChange = function(e, editor) {
   				
   			};
   			
   			vm.trixFocus = function(e, editor) {
   				
   			};
   			
   			vm.trixBlur = function(e, editor) {
   				
   			};
   			
   			vm.trixFileAccept = function(e, editor) {  	
 				e.preventDefault();
 				var theText;
  	   		    var element = document.querySelector("trix-editor");
  	   		   	var attachment = e.file;
  	   		   	var filename = attachment.name.split('.');
 	   		   	var ext = filename[1];
 	  
  	   		   	if(filename.length>2) {												// possible malware since more than one extension
					UtilityFactory.showAlertToast('<md-toast>Multiple file extensions are not allowed in ' + vm.params.appName + ' since this is a strong indicator the file may contain malware.</md-toast>');
  		   			return;

  	   		   	} else if(ext == 'txt') {												// parse txt file
					theText = extractText(attachment, '/add/php/parseTXT.php'); 	
				
  	   		   	} else if(ext == 'pdf') {												// parse pdf file
 	   		   		theText = extractText(attachment, '/add/php/parsePDF.php');
  	  	   			   		   	
	  	   		} else if(ext == 'rtf') {												// parse rtf file
	 	  			theText = extractText(attachment, '/add/php/parseRTF.php');
		 	   		
	  	   		} else if(ext == 'doc') {											// parse doc file
	  	   			theText = extractText(attachment, '/add/php/parseDOC.php');
		 	   		
	  	   		} else if(ext == 'docx') {											// parse doc file
	  	   			theText = extractText(attachment, '/add/php/parseDOCX.php');
  	   		
	  	   		} else if(ext == 'odt') {												// parse odt (openoffice file
	  	   			theText = extractText(attachment, '/add/php/parseODT.php');
	  	   		}
  			
    		};
    		
			var extractText = function(attachment, pathPHP) {	
				var theText, newLine, num, timer, chr;
				var fd = new FormData();
		  	   	fd.append("file", attachment);
		  	   	var xhr = new XMLHttpRequest();
		  	   	xhr.open("POST", pathPHP, true);
		  	   	xhr.send(fd);
		   		xhr.onreadystatechange = function() {
		   			if (xhr.readyState == 4 && xhr.status == 200) {
				   		theText = xhr.responseText;
						theText = theText.substring(6,theText.length-1);
			      		timer = $timeout(function() {     													// The focus code runs when setFlocus1 changes value, which includes the initial
			      			vm.data.theContent = vm.data.theContent + ' ' + theText;
			      		}); 																	// the timeout forces a digest update. When that is complete then setFocus is initialized to false
			 			$scope.$on("$destroy", function(event) {$timeout.cancel(timer)});
		            }
		   		};
		         
	          	xhr.onload = function() {
			  	  	var href, url;
			  	   	if (xhr.status === 204) {
			  	        url = href = pathPHP;
			  	        return attachment.setAttributes({
				  	      	url: url,
				  	      	href: href
				  	     });
				 	}
		       };		  	   	 	   			

   			};*/
   	}
})();
