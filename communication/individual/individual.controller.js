 (function () {    
    angular
        .module('root')
        .controller('IndividualController', IndividualController);

	   IndividualController.$inject = ['IndividualFactory', '$filter', '$location', '$route', 'SearchFactory', 'SheetService', 'CommunicationFactory', 'UtilityFactory', 'DatabaseService', 'NgTableParams'];
	   function IndividualController(   IndividualFactory,   $filter,   $location,   $route,   SearchFactory,   SheetService,   CommunicationFactory,   UtilityFactory,   DatabaseService,   NgTableParams) {

		var vm = this;
 		var _leftPerson = SheetService.getLeftPerson();

		vm.localData = [];
		vm.globalData = [];
		vm.personData = [];
		
		vm.fullName = _leftPerson.fullName;
		
		vm.cntrlFlags = {};		
		vm.cntrlFlags.inactiveTabs = true;
		vm.cntrlFlags.advancedSearch = false;
		vm.cntrlFlags.focusinControl = true;
		vm.cntrlFlags.showTable = false;
		vm.cntrlFlags.showListText = true;		
		vm.cntrlFlags.dropClass = 'dropzone';
		vm.cntrlFlags.inputIconClass = 'input-filter-placeholder';
		
 		vm.numMatches = 0;
		vm.soundex = true;
		vm.soundexDisabled = false;
 
 		vm.globalList = CommunicationFactory.getRecipients(_leftPerson.mainID);
 		if(vm.globalList.length>0) vm.cntrlFlags.showListText = false;

      	vm.showPeople = function(id) {
 
 				vm.globalData = IndividualFactory.getInterested(vm.params.curUserID) 
					.then(function successCallback(response) {
						vm.globalData = response;
    					vm.globalData = $filter('filter')(vm.globalData, function(value) {
    						var vn = this;
    						vn.value3 = value;
     						angular.forEach(vm.globalList, function(val, ndx, theArr) {
    							truthy = false;
    							if(vn.value3.mainID != val.mainID) {truthy=true}
    						}, vn);
    						return truthy;
    					}, true);
 						vm.tableParams.total(UtilityFactory.getLength(vm.globalData));
						vm.tableParams.reload();
						vm.cntrlFlags.showTable = true;													// make results table visible
						return
		 			}, function errorCallback(response) {
		 				$q.reject(response)				// See: http://davidcai.github.io/blog/posts/angular-promise/
		  				return angular.toJson(response.data);
					})




     		UtilityFactory.showDetails(id)
      			.then(function successCallback(response) {
					if (response.status=='200') {
	 					vm.data = response.data;
	      				vm.showDetail = !vm.showDetail;	
	      				return;
     			    } else {
						UtilityFactory.showAlertToast('<md-toast>Retrieval of details for ' + vm.surname + ' failed with the error:' + response.data.error + '.' + vm.appName +' has been notified</md-toast>');
						UtilityFactory.sendBugReport(response);
      				}
      			})
      	}

     	vm.tableParams = new NgTableParams({ 
 			page	: 1,
     		count	: 6
     		},{
     		getData : function(params) {
 	 			if(UtilityFactory.getLength(vm.globalData) == 0) return
    			var filteredData = vm.tableParams.filter() ? $filter('filter')(vm.globalData, vm.tableParams.filter()) : vm.globalData;
				var sortedData = vm.tableParams.sorting() ? $filter('orderBy')(filteredData, vm.tableParams.orderBy()) : filteredData;
				var tmp = sortedData.slice((vm.tableParams.page()-1)*vm.tableParams.count(), vm.tableParams.page() * vm.tableParams.count());		
				vm.localData = tmp;
	  			return vm.localData;
			}}
		)

		vm.showDetails = function(ndx) {
 			SearchFactory.setReturn(true);											// turn on return button on sheet page
			_leftPerson = vm.globalList[ndx];							// get new person from selected row of table
			SheetService.initSheet(_leftPerson.mainID);
			SearchFactory.setFromPage('communication')

        	$location.path('/sheet');
   			$route.reload();
			return;
      	}
		
 		vm.setAdvanced = function() {
			if(!vm.cntrlFlags.advancedSearch) {											// called before cb is updated, so use not operator
				vm.cntrlFlags.soundex = false;
				vm.cntrlFlags.soundexDisabled = true;
				vm.surname = '';
				vm.getInterestedPeople(vm.params.curUserID);
				return
			};
			vm.cntrlFlags.soundexDisabled = false;
				vm.cntrlFlags.showTable = false;
		}

		vm.checkSurname = function() {	
				if(angular.isUndefined(vm.surname) || vm.surname.length==0) {														// if surname search field is MT, then restart process
					vm.cntrlFlags.showTable = false;																	// return to step 1
					vm.globalData = [];																		// MT tableData
					vm.localData = [];																		// MT tableData
					vm.tableParams.reload();
					vm.cntrlFlags.dropClass = 'dropzone';
				};
				return
			};
			
			vm.receipentDrop = function(item) {
			    vm.globalData.push(vm.globalList[item]);
				vm.globalList = $filter('filter')(vm.globalList,  function(value, index) {return value.mainID != vm.globalList[item].mainID});
				vm.globalData = $filter('orderBy')(vm.globalData, 'mainID', false);
		        vm.tableParams.total(vm.tableParams.total() + 1);
		        if(UtilityFactory.getLength(vm.globalList) == 0) {
			        vm.cntrlFlags.showListText = true;
			       	vm.cntrlFlags.dropClass = 'dropzone';
			    }
		       	vm.tableParams.reload();
			};
			
			vm.peopleDrop = function(item) {
	 	        vm.globalList[UtilityFactory.getLength(vm.globalList)] = vm.globalData[vm.localToGlobal(item)];
				vm.globalData = $filter('filter')(vm.globalData,  function(value, index) {return value.mainID != vm.globalData[item].mainID});
				vm.globalList = $filter('orderBy')(vm.globalList, 'mainID', false);
		        vm.tableParams.total(vm.tableParams.total() - 1);
		        vm.cntrlFlags.showListText = false;
		       	vm.cntrlFlags.dropClass = 'dropzoneDrops';
		       	vm.tableParams.reload();
			};
	
			vm.clearFilters = function() {
				vm.tableParams.filter({});
			};
				
			vm.localToGlobal = function(row) {
				var curPage = vm.tableParams.page();														// get current row and page (local coord)
				var rowsPerPage = vm.tableParams.count();
				var ndx = (curPage - 1)*rowsPerPage + parseInt(row);
				return ndx;	
			};
				 
	 		vm.getPeople = function() {
		 			var query = "surname=" + vm.surname + "&soundex=" + vm.cntrlFlags.soundex
				DatabaseService.getNames(query)
					.then(function successCallback(response) {
						vm.globalData = response.data.theName;
    					vm.globalData = $filter('filter')(vm.globalData, function(value) {
    						var vn = this;
    						vn.value3 = value;
     						angular.forEach(vm.globalList, function(val, ndx, theArr) {
    							truthy = false;
    							if(vn.value3.mainID != val.mainID) {truthy=true}
    						}, vn);
    						return truthy;
    					}, true);
						vm.tableParams.total(UtilityFactory.getLength(vm.globalData));
						vm.cntrlFlags.showTable = true;
						vm.tableParams.reload();
						return
	 			}, function errorCallback(response) {
	 				$q.reject(response)				// See: http://davidcai.github.io/blog/posts/angular-promise/
	  				return angular.toJson(response.data);
				})
				return;
			};
			
			vm.getInterestedPeople = function() {
				vm.globalData = IndividualFactory.getInterested(vm.params.curUserID) 
					.then(function successCallback(response) {
						vm.globalData = response;
	   					vm.globalData = $filter('filter')(vm.globalData, function(value) {
    						var vn = this;
    						vn.value3 = value;
     						angular.forEach(vm.globalList, function(val, ndx, theArr) {
    							truthy = false;
    							if(vn.value3.mainID != val.mainID) {truthy=true}
    						}, vn);
    						return truthy;
    					}, true);
						vm.tableParams.total(UtilityFactory.getLength(vm.globalData));
						vm.tableParams.reload();
						vm.cntrlFlags.showTable = true;													// make results table visible
						return
		 			}, function errorCallback(response) {
		 				$q.reject(response)				// See: http://davidcai.github.io/blog/posts/angular-promise/
		  				return angular.toJson(response.data);
					})
					return;
				};
		}
})()
