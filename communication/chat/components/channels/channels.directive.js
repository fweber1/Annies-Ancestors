angular
	.module('root')
		
	.directive('channels', function() {
		return {
		restrict: "E",
		templateUrl: 'communication/chat/components/channels/channels.html',
		controller: function($scope, ConversationList){
			
			ConversationList.all().then(function(conversations){
				vm = this;
				
				$scope.channels = conversations.data.rooms
			})		
		}
	};
})