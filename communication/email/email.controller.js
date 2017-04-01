// ******************************************************
// Controller for Email
// ******************************************************

(function () {    'use strict';

    angular
        .module('root')		
        .controller('EmailController2', EmailController2)
 	  	
	    EmailController2.$inject = ['$filter', '$scope', '$http', '$q', '$timeout', '$resource',  'CommunicationFactory',  'UtilityFactory', 'DatabaseService', 'NgTableParams', 'Gparams'];
	   	function EmailController2(   $filter,   $scope,   $http,   $q,   $timeout,   $resource,    CommunicationFactory,    UtilityFactory,   DatabaseService,   NgTableParams,   Gparams) {

		var vm = this;
	
		vm.params = Gparams;
		vm.title = "My Inbox";
	 	vm.theMess = getMessages(vm.params.curUserID);	
	 	vm.emailRead = "false";

 		vm.globalList = CommunicationFactory.getRecipients(vm.params.curUserID);
 
 		$scope.emailDrop = function(item) {
 			
		}
 	
		vm.goToMessage = function(id) {
			alert("Will display email message.")
	      	if (id) {
		        var deferred = $q.defer();
                $http.get('communication/json/message/' + id + '.json')
                	.then(function(response){
                    	return response;
				}, function errorCallback(response) {
	 				$q.reject(response)														// See: http://davidcai.github.io/blog/posts/angular-promise/
	       			 return;
	       		})
		  	}
		}	
				
		function getMessages(id) {
	         $http.get('/communication/json/emails.json')
	         	.then(function successCallback(response){
	         		vm.theMess = response.data;
					vm.emailParams.reload();
					return response.data;
	  			}, function errorCallback(response) {
					$q.reject(response)				// See: http://davidcai.github.io/blog/posts/angular-promise/
					return angular.toJson(response.data);
				})
		}		  

		vm.emailParams = new NgTableParams({ 
 			page	: 1,
     		count	: 6
     		},{
     		getData : function(params) {
 				if(UtilityFactory.getLength(vm.theMess) == 0) return
 				vm.emailParams.total(vm.theMess.length);
  	   			var filteredData = params.filter() ? $filter('filter')(vm.theMess, params.filter()) : vm.theMess;
				var sortedData = params.sorting() ? $filter('orderBy')(filteredData, params.orderBy()) : filteredData;
				vm.emailData = sortedData.slice((params.page()-1)*params.count(), params.page() * params.count());
				return vm.emailData;
			}}
		);
  	}
})()