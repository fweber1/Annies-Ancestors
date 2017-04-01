(function () {
    'use strict';

	angular
        .module('root')
        .factory('SearchService', SearchService);

	    SearchService.$inject = ['$http', '$q'];
	   	function SearchService(   $http,   $q) {

		return {

	        getNames: function(query) {
				return $http({
						method	: "GET",
						url		: "/search/php/getNames.php?" + query,
					 	cache	: false
				})

				.then(function successCallback(response) {
	              return response;
	  			}, function errorCallback(response) {
	 				$q.reject(response);				// See: http://davidcai.github.io/blog/posts/angular-promise/
					return angular.toJson(response);
				})
			},

            addPerson: function(query) {
	        	alert(query)
                return $http({
                    method	: "GET",
                    url		: "/search/php/addPerson.php?" + query,
                    cache	: false
                })
                    .then(function successCallback(response) {
                        return response;
                    }, function errorCallback(response) {
                        $q.reject(response);				// See: http://davidcai.github.io/blog/posts/angular-promise/
                        return angular.toJson(response);
                    })
            }
		}

	}
})();
