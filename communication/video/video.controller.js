// ******************************************************
// Controller for video chat
// ******************************************************

(function () {    'use strict';

    angular
        .module('root')		
        .controller('VideoController', VideoController)
 	  	
	    VideoController.$inject = ['$filter', '$scope', '$http', '$q', '$timeout', '$resource', 'CommunicationFactory', 'UtilityFactory', 'DatabaseService', 'NgTableParams', 'Gparams', 'Gperson'];
	   	function VideoController(   $filter,   $scope,   $http,   $q,   $timeout,   $resource,   CommunicationFactory,   UtilityFactory,   DatabaseService,   NgTableParams,   Gparams,   Gperson) {

		var vm = this;

		vm.username = "fweberutkedu";
		vm.params = Gparams;
   		vm.showCalendar = false;
    		
		vm.globalList = CommunicationFactory.getRecipients(vm.params.curUserID);
 	
   		$(function() {																	// need following to prevent an error due to timing with the page load
      		var timer = $timeout(function() {     													// The focus code runs when setFlocus1 changes value, which includes the initial
 				vm.setFocus1 = false;	
 				vm.setFocus2 = false;
				vm.setFocus3 = false;
			}).then(function successCallback(response) {
				$scope.$on("$destroy", function(event) {$timeout.cancel(timer)});
				$http({																			// is ser registered with Skype?
				   	method	: 'GET',
					url		: '/communication/php/skype.php?userID=' + Gperson.mainID,
					headers	: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
					})
					.then(function successCallback(response) {
		  				if (response.status=='200' && response.data.results!='no') { 					
		  					vm.username = response.data.results.skype;
							vm.setFocus1 = false;
							vm.setFocus2 = true;
		 	  			} else{
							vm.setFocus1 = true;
							vm.setFocus2 = false;				
							$q.reject(response)				// See: http://davidcai.github.io/blog/posts/angular-promise/
						}
				})
  			})  		// the timeout forces a digest update. When that is complete then setFocus is initialized to false
 			} 																			// and when that is complete and another digest runs, then it is set to true which shows the page and sets focus on input
      	);    	
 
	    vm.doCalendar = function() {
	    	Gparams.showCalendar = !Gparams.showCalendar;
	    }
	    
		vm.doSubmit = function() {
		$http({																			// is ser registered with Skype?
		   	method	: 'POST',
			url		: '/communication/php/setSkype.php?userID=' + Gparams.curUserID + '&skype=' + vm.username,
			headers	: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
			})
			.then(function successCallback(response) {
  				if (response.status=='200') {
 					vm.setFocus1 = false;
					vm.setFocus2 = true;
                 } else {
 					vm.setFocus1 = true;
					vm.setFocus2 = false;				
	  				$q.reject(response)				// See: http://davidcai.github.io/blog/posts/angular-promise/
               }
 		})
		}
		
		vm.register = function() {
			var url = "https://signup.live.com/signup?lcid=1033&wa=wsignin1.0&rpsnv=13&ct=1482973062&rver=6.6.6577.0&wp=MBI_SSL&wreply=https%3a%2f%2flw.skype.com%2flogin%2foauth%2fproxy%3fsite_name%3dlw.skype.com%26form%3dmicrosoft_registration%26fl%3dphone2&lc=1033&id=293290&mkt=en-US&uaid=48aaf30e64b4a756182e8151ad0cd991&psi=skype&cobrandid=90010&client_flight=hsu%2cReservedFlight33%2cReservedFlight67&lw=1&fl=phone2&lic=1";
			var win = window.open(url, '_blank');
	  		win.focus();
  		}

		vm.download = function() {
			var url = "https://www.skype.com/en/download-skype/skype-for-computer/";
			var win = window.open(url, '_blank');
	  		win.focus();
		}
 	}
})()