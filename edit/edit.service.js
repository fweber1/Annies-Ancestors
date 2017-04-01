// updated 1/12/17, still in testing
		       
(function () {
    'use strict';

    angular
        .module('root')
        .factory('EditService', EditService);

    EditService.$inject = ['$filter', '$http', '$httpParamSerializer', '$q', '$timeout'];
    function EditService(   $filter,   $http,   $httpParamSerializer,   $q,   $timeout) {

		return {

// public functions
        
			uploadFile: function(query) {
				return $http({
				   	method	: 'POST',
					url		: '/edit/php/userFileUpload.php?' + query,
					headers	: {'Content-Type': 'multipart/form-data; charset=UTF-8'}
				})
	
				.then(function successCallback(response) {
	              	return response;
	  			}, function errorCallback(response) {
	 				$q.reject(response)	;			// See: http://davidcai.github.io/blog/posts/angular-promise/
					return response;
				})
			},
			
			getName: function(theInput) {			
				return $http({
				   	method	: 'POST',
					url		: '/edit/php/getName.php?mainID=' + theInput,
					headers	: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
				})

				.then(function successCallback(response) {
	              	return response;
	  			}, function errorCallback(response) {
	 				$q.reject(response);				// See: http://davidcai.github.io/blog/posts/angular-promise/
                    return response;
                })
			},
			
			updateName: function(theInput) {			
				return $http({
				   	method	: 'POST',
					url		: '/edit/php/updateName.php?' + $httpParamSerializer(theInput),
					headers	: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
				})

				.then(function successCallback(response) {
	              	return response;
	  			}, function errorCallback(response) {
	 				$q.reject(response)	;			// See: http://davidcai.github.io/blog/posts/angular-promise/
					return response;
				})
			},
		       		       
			getEvents: function(theInput) {	
				return $http({
				   	method	: 'POST',
					url		: '/edit/php/getEvents.php?personID=' + theInput,
					headers	: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
				})

				.then(function successCallback(response) {
	              	return response;
	  			}, function errorCallback(response) {
	 				$q.reject(response);				// See: http://davidcai.github.io/blog/posts/angular-promise/
					return response;
				})
			},
			
			deleteEvents: function(id) {		
				return $http({
				   	method	: 'POST',
					url		: '/edit/php/deleteEvents.php?id=' + id,
					headers	: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
				})

				.then(function successCallback(response) {
	              	return response;
	  			}, function errorCallback(response) {
	 				$q.reject(response);				// See: http://davidcai.github.io/blog/posts/angular-promise/
					return response;
				})
			},
			
			updateEvents: function(theInput) {		
				return $http({
				   	method	: 'POST',
					url		: '/edit/php/updateEvents.php?' + $httpParamSerializer(theInput),
					headers	: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
				})

				.then(function successCallback(response) {
	              	return response;
	  			}, function errorCallback(response) {
	 				$q.reject(response);				// See: http://davidcai.github.io/blog/posts/angular-promise/
					return response;
				})
			},

			getAttributes: function(theInput) {			
				return $http({
				   	method	: 'POST',
					url		: '/edit/php/getAttributes.php?personID=' + theInput,
					headers	: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
				})

				.then(function successCallback(response) {
	              	return response;
	  			}, function errorCallback(response) {
	 				$q.reject(response);			// See: http://davidcai.github.io/blog/posts/angular-promise/
					return response;
				})
			},
			
			updateAttributes: function(theInput) {			
				return $http({
				   	method	: 'POST',
					url		: '/edit/php/updateAttributes.php?' + $httpParamSerializer(theInput),
					headers	: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
				})

				.then(function successCallback(response) {
	              	return response;
	  			}, function errorCallback(response) {
	 				$q.reject(response);			// See: http://davidcai.github.io/blog/posts/angular-promise/
					return response;
				})
			},
			
			getMarriages: function(theInput) {		
				return $http({
				   	method	: 'POST',
					url		: '/edit/php/getMarriages.php?personID=' + theInput,
					headers	: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
				})

				.then(function successCallback(response) {
	              	return response;
	  			}, function errorCallback(response) {
	 				$q.reject(response);			// See: http://davidcai.github.io/blog/posts/angular-promise/
					return response;
				})
			},
	   				       
			updateMarriages: function(theInput) {		
				return $http({
				   	method	: 'POST',
					url		: '/add/php/updateMarriage.php?' + $httpParamSerializer(theInput),
					headers	: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
				})

				.then(function successCallback(response) {
	              	return response;
	  			}, function errorCallback(response) {
	 				$q.reject(response);			// See: http://davidcai.github.io/blog/posts/angular-promise/
					return response;
				})
			},
	   				       
			getStory: function(theInput) {			
				return $http({
				   	method	: 'POST',
					url		: '/edit/php/getStory.php?' + $httpParamSerializer(theInput),
					headers	: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
				})

				.then(function successCallback(response) {
	              	return response;
	  			}, function errorCallback(response) {
	 				$q.reject(response);				// See: http://davidcai.github.io/blog/posts/angular-promise/
                    return response;
                })
			},
		       
			updateStory: function(theInput) {			
				return $http({
				   	method	: 'POST',
					url		: '/edit/php/updateStory.php?' + $httpParamSerializer(theInput),
					headers	: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
				})

				.then(function successCallback(response) {
	              	return response;
	  			}, function errorCallback(response) {
	 				$q.reject(response);				// See: http://davidcai.github.io/blog/posts/angular-promise/
                    return response;
                })
			},
		       
			getMedia: function(theInput) {	
				return $http({
				   	method	: 'POST',
					url		: '/add/php/getMedia.php?' + $httpParamSerializer(theInput),
					headers	: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
				})

				.then(function successCallback(response) {
	              	return response;
	  			}, function errorCallback(response) {
	 				$q.reject(response);				// See: http://davidcai.github.io/blog/posts/angular-promise/
                    return response;
                })
			},
		       
			updateMedia: function(theInput) {	
				return $http({
				   	method	: 'POST',
					url		: '/add/php/updateMedia.php?' + $httpParamSerializer(theInput),
					headers	: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
				})

				.then(function successCallback(response) {
	              	return response;
	  			}, function errorCallback(response) {
	 				$q.reject(response);				// See: http://davidcai.github.io/blog/posts/angular-promise/
                    return response;
                })
			},

 		}

	}
})();