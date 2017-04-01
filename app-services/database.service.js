// updated 1/12/17, still in testing

(function () {
    'use strict';

    angular
        .module('root')
        .factory('DatabaseService', DatabaseService);

    DatabaseService.$inject = ['$filter', '$http', '$httpParamSerializer', '$q', '$cacheFactory'];
    function DatabaseService($filter, $http, $httpParamSerializer, $q, $cacheFactory) {
		var service = {};

		return {
        
					
			getInterest: function(query) {
				return $http({
						method	: "get",
						url		: "/communication/php/getInterest.php?" + query,
					 	cache	: false
				})
				
				.then(function successCallback(response) {
	              return response;
	  			}, function errorCallback(response) {
	 				$q.reject(response)				// See: http://davidcai.github.io/blog/posts/angular-promise/
					return angular.toJson(response);
				})
			},
					
			getRecipients: function(query) {
				return $http({
						method	: "get",
						url		: "/communication/php/getRecipients.php?" + query,
					 	cache	: false
				})
				
				.then(function successCallback(response) {
	              return response;
	  			}, function errorCallback(response) {
	 				$q.reject(response)				// See: http://davidcai.github.io/blog/posts/angular-promise/
					return angular.toJson(response);
				})
			},
					
			setRecipients: function(query) {
				return $http({
						method	: "post",
						url		: "/communication/php/setRecipients.php?" + query,
					 	cache	: false
				})
				
				.then(function successCallback(response) {
	              return response;
	  			}, function errorCallback(response) {
	 				$q.reject(response)				// See: http://davidcai.github.io/blog/posts/angular-promise/
					return angular.toJson(response);
				})
			},
			
			getNames: function(query) {
				return $http({
						method	: "GET",
						url		: "/communication/php/getNames.php?" + query,
				})
				
				.then(function successCallback(response) {
	              return response;
	  			}, function errorCallback(response) {
	 				$q.reject(response)				// See: http://davidcai.github.io/blog/posts/angular-promise/
					return response;
				})
			},	
			
			
			getNotes: function(id) {
			
				var theResponse = $.ajax({async:false, method: 'GET', url: "app-services/php/getNotes.php", data:{personID:id}, contentType:'multipart/form-data'});
		
				var data = theResponse.responseText;
		 		data = angular.fromJson(data);
	
			  	return data; 
			  	
	    	},
	
			getNameFact: function(theName) {
/*	    		var theURL = "http://en.wikipedia.org/w/api.php?action=parse&format=json&prop=text&redirects&page=" + theName  + "&callback=JSON_CALLBACK";
	   			return $http.jsonp(theURL)
					.then(function successCallback(response) {
	               	return response;
	  			}, function errorCallback(response) {
	 				$q.reject(response)				// See: http://davidcai.github.io/blog/posts/angular-promise/
					return angular.toJson(response);
				})
*/	   		},
	 	
	    	getHistoryFact: function(theDate) {
/*	    		var theURL = 'http://en.wikipedia.org/w/api.php?action=parse&format=json&prop=text&section=1&page=' + $filter('date')(new Date(), 'MMMM_dd') + '&callback=JSON_CALLBACK';
	   			return $http.jsonp(theURL)
					.then(function successCallback(response) {
	               	return response;
	  			}, function errorCallback(response) {
	 				$q.reject(response)				// See: http://davidcai.github.io/blog/posts/angular-promise/
					return angular.toJson(response);
				})
*/	   		}
   		}

	}
})();