// ******************************************************
// Controller for Communication
// ******************************************************

(function () {    'use strict';

    angular
        .module('root')
		
        .controller('CommunicationController', CommunicationController)
    
    	.config(function() { })
	  	
    CommunicationController.$inject = ['$filter', '$scope', '$http', '$q', '$timeout', '$resource', 'UtilityFactory', 'CommunicationFactory', 'DatabaseService',  'NgTableParams', 'Gparams'];
   	function CommunicationController(   $filter,   $scope,   $http,   $q,   $timeout,   $resource,   UtilityFactory,   CommunicationFactory,   DatabaseService,    NgTableParams,   Gparams) {
 
		var vm = this;
	
		vm.params = Gparams;
	 		
		vm.saveRecipients = function() {CommunicationFactory.setRecipients(vm.params.curUserID, vm.globalList)}
   	}
})
()

