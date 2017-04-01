// ******************************************************
// This service return the list of the conversation of the user. (Does not include the one-to-one conversations).
// ******************************************************

angular
	.module('root')
		
	.factory('ConversationList', ['$http', function conversationListFactory($http) {	  
		this.conversations = []
		var vm = this;

		var all = function() {
			return $http({
				method	: "GET",
				url		: "/communication/chat/php/getConversations.php"
			})
			
			.then(function successCallback(response) {
				return response;
			}, function errorCallback(response) {
				$q.reject(response)				// See: http://davidcai.github.io/blog/posts/angular-promise/
				return angular.toJson(response);
			});
		};	
	
		var find = function(findObject){	    
			return _.find(vm.conversations, findObject);	
		}
	
		return {all: all, find: find}
	
	}])