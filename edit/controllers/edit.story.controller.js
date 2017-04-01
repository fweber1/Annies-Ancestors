// ******************************************************
//
// Person Controller
//
// To Do
// 		in getFamily.php, set flag on stories that are used in the web site
//		then, add a warning on delete of story
//
// ******************************************************

(function () {    'use strict';

    angular
		.module('root')
        .controller('EditStoryController', EditStoryController)
    
    	.config(function() {	  		
		});
		
    EditStoryController.$inject = [ '$scope', '$state', '$mdDialog', '$filter', 'UtilityFactory',  'SearchFactory', 'EditService', 'Gparams'];
   		function EditStoryController($scope,   $state,   $mdDialog,   $filter,   UtilityFactory,    SearchFactory,   EditService,   Gparams) {
   
   			var vm = this;
   			var tmp;
   			var ids = [];
   			var titles = [];
   			
			vm.data = {};
			vm.data.ownerID = 0;
  			vm.tab = 4;
  			vm.params = Gparams;	
  			vm.data.showType = true;
 
			vm.doChange4 = doChange4;														//prototype function declaration so can be callled before defined
   			vm.doDelete4 = doDelete4;
   			vm.doAdd4 = doAdd4;
  			vm.init4 = init4;
   			vm.onReset = onReset;
   			vm.showDetails4 = showDetails4;
   			vm.searchPage4 = searchPage4;
   			vm.onSubmit4 = onSubmit4;

   			init4();
   			
   			function init4() {
				vm.data = angular.copy(UtilityFactory.getFamily());
	   			vm.data.theContent = ''; 
	   			vm.data.theType = 'text';
	 			vm.data.ownerID = vm.params.curUserID;
		 		vm.data.details = $filter('filter')(vm.data.media, {theType:'story'}, true)[0];
		 		vm.data.selected = vm.data.details.id;
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
   			
   			function doChange4() {
   				
   			}
   			
			function doDelete4() {
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

			function doAdd4() {
		 		vm.data.details = {};				
				vm.data.dateModifier = vm.modList[0];
				vm.data.showType = false;

			}
   			
   			function onReset() {
   				vm.data = {};
   				vm.init4();
   			}

   			function showDetails4(who) {  
 	        	$state.go('sheet', {obj:{name:'editStories', tab:vm.tab, whoID:who}});
	      	}

   			function searchPage4(who,what) {  
	        	$state.go('search', {obj:{name:'editStories', search:vm.data.surname, tab:vm.tab, what:what, who:who}});
	      	}

   			function onSubmit4 () {
				vm.data.showType = true;
				EditService.editStory(vm.data)
	           	.then(function successCallback(response) {
	  				if (response.status=='200') {
						UtilityFactory.showTemplateToast('<md-toast>The story was successfully updated in ' + vm.params.appName + '.</md-toast>');
						vm.onReset();

					} else {
		  				UtilityFactory.showAlertToast('<md-toast>' + err + '. Please reenter.</md-toast>');
					}	
	           	});
			}
	      	
		   var events = ['trixInitialize', 'trixChange', 'trixSelectionChange', 'trixFocus', 'trixBlur', 'trixFileAccept'];

	   	    for (var i = 0; i < events.length; i++) {
	   	        $scope[events[i]] = function(e) {
	   	            document.getElementById(e.type).className = 'active';
	   	            $timeout(function() {
	   	                document.getElementById(e.type).className = '';
	   	            }, 500);
	   	        };
            }
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


  	   		   	} else if(ext == 'txt') {												// parse txt file
					theText = extractText(attachment, '/edit/php/parseTXT.php'); 	
				
  	   		   	} else if(ext == 'pdf') {												// parse pdf file
 	   		   		theText = extractText(attachment, '/edit/php/parsePDF.php');
  	  	   			   		   	
	  	   		} else if(ext == 'rtf') {												// parse rtf file
	 	  			theText = extractText(attachment, '/edit/php/parseRTF.php');
		 	   		
	  	   		} else if(ext == 'doc') {											// parse doc file
	  	   			theText = extractText(attachment, '/edit/php/parseDOC.php');
		 	   		
	  	   		} else if(ext == 'docx') {											// parse doc file
	  	   			theText = extractText(attachment, '/edit/php/parseDOCX.php');
  	   		
	  	   		} else if(ext == 'odt') {												// parse odt (openoffice file
	  	   			theText = extractText(attachment, '/edit/php/parseODT.php');
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

   			};
   			
			$scope.showConfirm = function() {
			    var confirm = $mdDialog.confirm()
			          .title('Are You Sure You Want to Delete the Story with Title "' + vm.data.details.theTitle + '"?')
			          .textContent('The story will be permamently deleted and this can not be undone.')
			          .ariaLabel('Delete Story')
			          .ok('OK')
			          .cancel('Cancel');

			    $mdDialog.show(confirm).then(function() {
	  				UtilityFactory.showTemplateToast('<md-toast>The story with Title "' + vm.data.details.theTitle + '" has been deleted.</md-toast>');
			    }, function() {
	  				UtilityFactory.showTemplateToast('<md-toast>The deletion has been canceled.</md-toast>');
			    });
			};
  		}
   	
})();
