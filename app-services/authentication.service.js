// updated 1/12/17, still in testing

(function () {
    'use strict';

    angular
        .module('root')
        .factory('AuthenticationService', AuthenticationService);

    AuthenticationService.$inject = ['DatabaseService', '$http', '$httpParamSerializer', 'UtilityFactory', '$location', '$q', 'Gparams'];
    function AuthenticationService(   DatabaseService,   $http,   $httpParamSerializer,   UtilityFactory,   $location,   $q,   Gparams) {

		return {

	       Login: function(theData) {
				return $http({
			   	method	: 'POST',
				url		: '/session/php/login.php?' + $httpParamSerializer(theData),
				headers	: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
				})
				
				.then(function successCallback(response) {
	   				return response; 			
	 
	 			}, function errorCallback(response) {	
	  				$q.reject(response)				// See: http://davidcai.github.io/blog/posts/angular-promise/
					return angular.toJson(response);
				})
	   		},
	
	        SetCredentials: function(theData) {
	            Gparams.curUserID = theData.mainID;
	            Gparams.personID = theData.mainID;
	            Gparams.mainDisabled = false;
	        },
	
	        ClearCredentials: function() {
	            Gparams.curUserID = Gparams.defaultID;
	            Gparams.personID = Gparams.defaultID;
	            Gparams.mainDisabled = true;
	       },
	        
	       CheckCredentials: function() {
	          	var loggedIn = true;
	            if (GcurUserID != GdefaultID) {
	            	loggedIn = false;
	            	return loggedIn;
	        	};	   		
	   		}
	   	}
	}
})();