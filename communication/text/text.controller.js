// ******************************************************
// Controller for text chat
// ******************************************************

(function () {    'use strict';

    angular
        .module('root')		
        .controller('TextController', TextController)
 	  	
	    TextController.$inject = ['$filter', '$scope', '$http', '$q', '$timeout', '$resource', 'CommunicationFactory', 'UtilityFactory', 'DatabaseService', 'NgTableParams', 'Gparams'];
	   	function TextController(   $filter,   $scope,   $http,   $q,   $timeout,   $resource,   CommunicationFactory,   UtilityFactory,   DatabaseService,   NgTableParams,   Gparams) {

		var vm = this;

		vm.params = Gparams;
  		vm.globalList = CommunicationFactory.getRecipients(vm.params.curUserID);
	}
})()