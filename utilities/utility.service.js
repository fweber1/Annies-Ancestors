// updated 1/12/17, still in testing

(function () {
    'use strict';
    angular
        .module('root')
        .factory('UtilityService', UtilityService);

    UtilityService.$inject = ['$http', '$httpParamSerializer', '$q'];
    function UtilityService(   $http,   $httpParamSerializer,   $q) {

		return {

		    getFamily: function(id) {
				return $http({
						method	: "GET",
						url		: "/utilities/php/getFamily.php?personID=" + id,
					 	cache	: false
				})

				.then(function successCallback(response) {
					console.log(response)
		          return response.data.person;
					}, function errorCallback(response) {
						$q.reject(response)	;			// See: http://davidcai.github.io/blog/posts/angular-promise/
					return angular.toJson(response);
				})
			},

			sendMail: function(data) {
				return $http({
				 	method	: 'POST',
					url		: '/utilities/php/sendMail.php?' + $httpParamSerializer(data),
					headers	: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
				})

				.then(function successCallback(response) {
					return response;
				}, function errorCallback(response) {
					$q.reject(response)	;			// See: http://davidcai.github.io/blog/posts/angular-promise/
					return angular.toJson(response);
				})
			},

			sendBugReport: function(data) {
				$http({
				 	method	: 'POST',
					url		: '/utilities/php/sendMail.php?' + $httpParamSerializer(data),
					headers	: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
				})

				.then(function successCallback(response) {
					return response;
				}, function errorCallback(response) {
					$q.reject(response);				// See: http://davidcai.github.io/blog/posts/angular-promise/
					return angular.toJson(response);
				})
			},
		}
    }
})();