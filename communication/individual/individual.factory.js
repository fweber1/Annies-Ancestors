angular
	.module('root')
		
	.factory('IndividualFactory', function(DatabaseService, UtilityFactory) {				
		
		getInterested = function(id) {
			var exports = {};
 			var query = "id=" + id;
			return DatabaseService.getInterest(query)
				.then(function successCallback(response) {
					exports.globalData = response.data.theName;
					return exports.globalData
 			}, function errorCallback(response) {
 				$q.reject(response)				// See: http://davidcai.github.io/blog/posts/angular-promise/
  				return angular.toJson(response.data);
			})
			return
		};
			
		return {
			getInterested: getInterested
		}

})