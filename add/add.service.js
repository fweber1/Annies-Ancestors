// updated 1/12/17, still in testing

(function () {
    'use strict';

    angular
        .module('root')
        .factory('AddService', AddService);

    AddService.$inject = ['$filter', '$http', '$httpParamSerializer', '$q', '$timeout'];
    function AddService(   $filter,   $http,   $httpParamSerializer,   $q,   $timeout) {

		var _reload;
 		var _createdList;
 		var _curPerson;
 		var _theData;
 		
		return {

// public functions
        
			uploadFile: function(query) {
				return $http({
				   	method	: 'POST',
					url		: '/add/php/userFileUpload.php?' + query,
					headers	: {'Content-Type': 'multipart/form-data; charset=UTF-8'}
				})
	
				.then(function successCallback(response) {
	              	return response;
	  			}, function errorCallback(response) {
	 				$q.reject(response)	;			// See: http://davidcai.github.io/blog/posts/angular-promise/
					return response;
				})
			},
			
			checkName: function(theInput) {			
				return $http({
				   	method	: 'POST',
					url		: '/add/php/testName.php?' + $httpParamSerializer(theInput),
					headers	: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
				})

				.then(function successCallback(response) {
	              	return response;
	  			}, function errorCallback(response) {
	 				$q.reject(response)	;			// See: http://davidcai.github.io/blog/posts/angular-promise/
					return response;
				})
			},
			
			addName: function(theInput) {			
				return $http({
				   	method	: 'POST',
					url		: '/add/php/addName.php?' + $httpParamSerializer(theInput),
					headers	: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
				})

				.then(function successCallback(response) {
	              	return response;
	  			}, function errorCallback(response) {
	 				$q.reject(response);				// See: http://davidcai.github.io/blog/posts/angular-promise/
                    return response;
                })
			},
		       
			addStory: function(theInput) {			
				return $http({
				   	method	: 'POST',
					url		: '/add/php/addStory.php?' + $httpParamSerializer(theInput),
					headers	: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
				})

				.then(function successCallback(response) {
	              	return response;
	  			}, function errorCallback(response) {
	 				$q.reject(response);				// See: http://davidcai.github.io/blog/posts/angular-promise/
                    return response;
                })
			},
		       
			addMedia: function(theInput) {	
				return $http({
				   	method	: 'POST',
					url		: '/add/php/addMedia.php?' + $httpParamSerializer(theInput),
					headers	: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
				})

				.then(function successCallback(response) {
	              	return response;
	  			}, function errorCallback(response) {
	 				$q.reject(response);				// See: http://davidcai.github.io/blog/posts/angular-promise/
                    return response;
                })
			},
		       
			addEvent: function(theInput) {		
				return $http({
				   	method	: 'POST',
					url		: '/add/php/addEvent.php?' + $httpParamSerializer(theInput),
					headers	: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
				})

				.then(function successCallback(response) {
	              	return response;
	  			}, function errorCallback(response) {
	 				$q.reject(response);				// See: http://davidcai.github.io/blog/posts/angular-promise/
					return response;
				})
			},
			
			addAttribute: function(theInput) {			
				return $http({
				   	method	: 'POST',
					url		: '/add/php/addAttribute.php?' + $httpParamSerializer(theInput),
					headers	: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
				})

				.then(function successCallback(response) {
	              	return response;
	  			}, function errorCallback(response) {
	 				$q.reject(response);			// See: http://davidcai.github.io/blog/posts/angular-promise/
					return response;
				})
			},
		       
			addMarriage: function(theInput) {		
				return $http({
				   	method	: 'POST',
					url		: '/add/php/addMarriage.php?' + $httpParamSerializer(theInput),
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