// updated 1/12/17, still in testing

(function () {
    'use strict';

    angular
        .module('root')
        .factory('SessionService', SessionService);

    SessionService.$inject = ['$http', '$httpParamSerializer', '$q'];
    function SessionService(   $http,   $httpParamSerializer,   $q) {

		return {
		      
				changeEmail: function(theData) { 			
		 			return $http({
					   	method	: 'POST',
						url		: '/session/php/changeEmail.php?' + $httpParamSerializer(theData),
						headers	: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
					})
					
					.then(function successCallback(response) {
		   				return response; 			
		 
		 			}, function errorCallback(response) {	
		  				$q.reject(response);				// See: http://davidcai.github.io/blog/posts/angular-promise/
						return response;
					})
		   		},

		   		getPerson: function(id) {
				return $http({
						method	: "get",
						url		: "/session/php/getPerson.php?personID=" + id,
					 	cache	: false
				})
				
				.then(function successCallback(response) {
	              return response;
	  			}, function errorCallback(response) {
	 				$q.reject(response);				// See: http://davidcai.github.io/blog/posts/angular-promise/
					return angular.toJson(response);
				})
			},

			createUser: function(theData) {
				return $http({
				   	method	: 'POST',
					url		: '/session/php/registerUser.php?' + theData,
					headers	: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
				})
				
				.then(function successCallback(response) {
	               return response;
	  			}, function errorCallback(response) {
	 				$q.reject(response);			// See: http://davidcai.github.io/blog/posts/angular-promise/
					return angular.toJson(response);
				})
			},

			changePswd: function(theData) {
		  		return $http({
				   	method	: 'POST',
					url		: '/session/php/password.php?' + $httpParamSerializer(theData),
					headers	: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
				})
				
				.then(function successCallback(response) {
					return response;
	  			}, function errorCallback(response) {
		  			$q.reject(response);				// See: http://davidcai.github.io/blog/posts/angular-promise/
					return response;
				})
			},

			checkEmail: function(theData) {
				return $http({
						method	: "get",
						url		: "/session/php/checkUserExists.php?email=" + theData,
					 	cache	: false
				})
				
				.then(function successCallback(response) {
	              	return response;
	  			}, function errorCallback(response) {
	 				$q.reject(response);				// See: http://davidcai.github.io/blog/posts/angular-promise/
					return angular.toJson(response);
				})
			},

			login: function(theData) {
				return $http({
			   	method	: 'POST',
				url		: '/session/php/login.php?' + $httpParamSerializer(theData),
				headers	: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
				})
				
				.then(function successCallback(response) {
	   				return response; 			
	 
	 			}, function errorCallback(response) {	
	  				$q.reject(response);			// See: http://davidcai.github.io/blog/posts/angular-promise/
					return response;
				})
	   		},
	
	   	}
	}
})();