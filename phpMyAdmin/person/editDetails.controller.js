// ******************************************************
//
// Person Controller
//
// ******************************************************

(function () {    'use strict';

    angular
		.module('root')
        .controller('PersonController', PersonController)
    
    	.config(function() {	  		
		});
		
    	PersonController.$inject = ['$scope', '$http', '$httpParamSerializer', 'DatabaseService'];
   		function PersonController($scope, $http, $httpParamSerializer, DatabaseService) {
   
     		$scope.focusinControl = {};														// puts focus on input element
			$scope.addUser = {};
			$scope.addBirth = {};
			$scope.addDeath = {};

	   		$scope.currentID = 6120;																		// WARNING: eventaully has to come from login page
 
  		 	$scope.person = DatabaseService.getPerson($scope.currentID);
 			
			var vm = this;
						
			$scope.resultVarName = '';
			
			$scope.upload = {
				personID : 0,
				step	 : 1,
				modifier : 'EXA'
			};
			
		var myDropzone = new Dropzone("#uploadFile", {
				url						: "/person/php/uploadProfile.php",
				method					: "POST",
				paramName				: "file",
				clickable				: true,
 				previewsContainer		: ".dz-preview",
 				maxFilesize				: 5,
				maxFiles				: 1,
				uploadMultiple			: false,
				parallelUploads			: 1,
				createImageThumbnails	: false,
				renameFilename			: function (name) {return vm.personID + '.' + name.substr(name.lastIndexOf('.')+1);},
				autoProcessQueue		: true,
				acceptedFiles			: '.jpeg, .jpg, .gif, .png'	,			
   				init					: function() {
        										this.on("success", function(file, responseText) {
 													$scope.showTemplateToast('<md-toast>The profile photo was successfully added to ' + $scope.params.appName + '.</md-toast>');
        											$scope.doStep();
        										});
    										}
			});

			$scope.onSubmit = function(form) {
				$scope.showDups = false;
				$http({
				   	method	: 'POST',
    				url		: '/person/php/addName.php?' + $httpParamSerializer($scope.addUser),
    				headers	: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
    			})
					.success(function successCallback(response) {
						response = angular.fromJson(response);
						var success = response.results.success;
						if (success=='succeeded') {							// insert succeeded, so show toast and return
							$scope.showTemplateToast('<md-toast>' + $scope.addUser.givenName + ' ' + $scope.addUser.surname + ' was successfully added to ' + $scope.params.appName + '.</md-toast>');
							$scope.personID = response.results.newID,
							vm.personID = response.results.newID;
							$scope.upload.personID = vm.personID;
								
							form.$setUntouched();
							form.$setPristine();
							$scope.doStep();
							$scope.safeApply();
							return;
						}
						
						$scope.addUser = {};
						form.$setUntouched();
						form.$setPristine();
						
						// extract data from return of the form processing
						
						var nHits = response.errors.exists;
						$scope.nRows = nHits;
						var value = response.errors.values.substring(1);
						value = value.replace(/,,/g,',-,');				
						value = value.replace(/,,/g,',-,');				
						var people = value.split('|');
						$scope.theDups = [];
					
						 if(nHits>0) {								// failed due to existing perople in the DB
							for (i=1;i<=nHits;i++) { 
								fields = people[i-1].split(',');
		       						$scope.$safeApply();
		 							$scope.theDups.push({
										firstName: fields[0],
										lastName:  fields[1],
										birthDate: fields[2],
										birthCity: fields[3],
										deathDate: fields[4],
										deathCity: fields[5],
				      			 });
							}
							$('#triggerShowDups').click();
							if($('#toggleMeta').css('height') > 0) $('#toggleMeta').click();
						} else {											// a general error occurred so put up alert and send bug report
							$scope.showAlertToast('<md-toast> An internal error occurred. ' + $scope.appName + ' has been notified. Please try again later.</md-toast>');
			       			$scope.sendBugReport(data);					
						}
						
		  }, function errorCallback(response) {
		  		var failed = form.$error;
				$scope.showAlertToast('<md-toast> An internal error occurred. ' + $scope.appName + ' has been notified. Please try again later.</md-toast>');
	   			$scope.sendBugReport(data);
		  });
					  	 	
	   
 	};

			$scope.onSubmit2 = function(form) {
				$scope.showDups = false;
				$http({
				   	method	: 'POST',
    				url		: '/person/php/addBirthDeath.php?' + $httpParamSerializer($scope.addBirth) + $httpParamSerializer($scope.addDeath),
    				headers	: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
    			})
					.success(function successCallback(response) {
						response = angular.fromJson(response);
						var success = response.results.success;
						if (success=='succeeded') {							// insert succeeded, so show toast and return
							$scope.showTemplateToast('<md-toast>The birth and death statistics for ' + addUser.givenName + ' ' + $scope.addUser.surname + ' was successfully added to ' + $scope.params.appName + '.</md-toast>');
								
							form.$setUntouched();
							form.$setPristine();
							$scope.upload.noSubmit = false;
							$scope.doStep();
							$scope.safeApply();
							return;
						}
		  }, function errorCallback(response) {
		  		var failed = form.$error;
				$scope.showAlertToast('<md-toast> An internal error occurred. ' + $scope.appName + ' has been notified. Please try again later.</md-toast>');
	   			$scope.sendBugReport(data);
		  });	   
 	};
 	
 		$scope.onReset = function() {
			$scope.addUser = {};
    		$scope.focusinControl = {};														// puts focus on input element
			$scope.safeApply();
		};
		
		$scope.onReset2 = function() {
			$scope.addBirth = {};
			$scope.addDeath = {};
			$scope.safeApply();
		};
		
		$scope.doStep = function() {
			$scope.upload.step++;
			$scope.safeApply();
		};
			
		$scope.onChange = function(item) {
			$scope.upload.modifier = item.value;
		};
 
};	
})
()	
