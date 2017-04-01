// updated 1/12/17, still in testing

(function () {    'use strict';

    angular
        .module('root')
        .controller('SearchController', SearchController);

    SearchController.$inject = ['UtilityFactory', 'SearchService', '$filter', '$state', '$stateParams', 'NgTableParams', 'Gparams'];
   	function SearchController(   UtilityFactory,   SearchService,   $filter,   $state,   $stateParams,   NgTableParams,   Gparams) {

   		var vm = this;

   		vm.params = Gparams;
		vm.numMatches = 0;
		vm.selectedRow = -1;
		vm.soundex = true;
		vm.setFocus = true;
		vm.fromPage = '';
		vm.tab = -1;
		vm.flags = {};
		vm.data = {};
	    vm.data = UtilityFactory.getFamily();
	    vm.flags.fatherID = vm.data.fathers[vm.data.curFather].mainID;
	    vm.flags.motherID = vm.data.mothers[vm.data.curMother].mainID;

	    vm.getPeople = getPeople;

        try {
			vm.fromPage = $stateParams.obj.name;
			vm.tab = $stateParams.obj.tab;
            vm.flags.who = $stateParams.obj.who;
 			vm.flags.what = $stateParams.obj.what;
 			vm.flags.surname = $stateParams.obj.surname;
		} catch(err) {
			vm.fromPage = '';
			vm.tab = -1;
			vm.flags.what = 'main';
	        vm.flags.surname = '';
		}

       vm.getPeople();

        vm.showReturn = angular.isUndefined(vm.fromPage) || vm.fromPage==='';

    	vm.tableParams = new NgTableParams({
 			page	: 1,
     		count	: 6
     		},{
   			getData : function() {
     			if(angular.isDefined(vm.theData)) {
                    var results = vm.theData;
                    var filteredData = vm.tableParams.filter() ? $filter('filter')(results, vm.tableParams.filter()) : results;
                    var sortedData = vm.tableParams.sorting() ? $filter('orderBy')(filteredData, vm.tableParams.orderBy()) : filteredData;
                    vm.tableParams.total(UtilityFactory.getLength(sortedData));
                    vm.tableData = sortedData;
                    vm.tableData = vm.tableData.slice((vm.tableParams.page() - 1) * vm.tableParams.count(), vm.tableParams.page() *
						vm.tableParams.count());
                }
                return vm.tableData;
            }}
		);

      	vm.showDetails = function(ndx) {
      		vm.oldMainID = vm.params.curPersonID;																					// save current person ID so can reset on return
        	vm.mainID = UtilityFactory.setFamily(vm.tableData[ndx].mainID)
				.then(function successCallback(response) {
                if (response.status===200) {
                    $state.go('sheet', {obj:{name:'search', who:vm.mainID}});
                } else {
                    UtilityFactory.showAlertToast('<md-toast>Switching to detailed view failed with the error:' + response.data.error +
						'.' + vm.appName + ' has been notified</md-toast>');
                }
            });
      	};

		vm.checkSurname = function() {
			if(angular.isUndefined(vm.surname)) {
				vm.setFocus2 = false;
				vm.setFocus1 = true;
			}
		};

        vm.setPerson = function (selectedRow) {
            vm.selectedRow = selectedRow;
        };

        vm.setSelected = function () {								// NOTE: each of 3 functions still need processing of change
			vm.data = UtilityFactory.setFamily(vm.tableData[vm.selectedRow].mainID)
               .then(function successCallback(response) {
                   if (response.status === 200) {
                       Gparams.curPersonID = vm.data.mainID;
                       Gparams.curPersonName = vm.data.fullName;
                       vm.returnToStart();
                   } else {
                       UtilityFactory.showAlertToast('<md-toast>Changing to the current person failed with the error:' +
                           response.data.error + '.' + vm.appName + ' has been notified</md-toast>');
                       vm.returnToStart();
                   }
               });
         };

        vm.addSelected = function () {
            var query;
            query = 'ownerID=' + vm.params.curUserID;
            if(vm.what === 'spouse') {
	            query = query + '&mainID=' + vm.params.curPersonID + '&childID=0&spouseID=' + vm.tableData[vm.selectedRow].mainID;
            } else if(vm.what === 'father') {
	            query = query + '&mainID=' + vm.flags.fatherID + '&childID=' + vm.data.mainID + '&spouseID=' + vm.tableData[vm.selectedRow].mainID;
            } else {
                query = query + '&mainID=' + vm.flags.motherID + '&childID=' + vm.data.mainID + '&spouseID=' + vm.tableData[vm.selectedRow].mainID;
            }

            SearchService.addPerson(query)
                .then(function successCallback(response) {
                    if (response.status===200) {
                        UtilityFactory.setFamily(vm.tableData[vm.selectedRow].mainID)
                            .then(function successCallback(response) {
                                if (response.status===200) {
                                    vm.returnToStart();
                                } else {
                                    UtilityFactory.showAlertToast('<md-toast>Adding a ' + vm.flags.what +
										' to the current person failed with the error:' + response.data.error + '.' + vm.appName +
										' has been notified</md-toast>');
                                    vm.returnToStart();
                                }
                            });
	                    vm.returnToStart();
                    } else {
                        UtilityFactory.showAlertToast('<md-toast>The search change for people named' + vm.surname +
							' failed with the error:' + response.data.error + '.' + vm.appName +' has been notified</md-toast>');
                        UtilityFactory.sendBugReport(response);
                        vm.returnToStart();
                    }
                });
        };

        vm.replaceSelected = function () {
            vm.returnToStart();
        };

        function getPeople() {
			var query = 'surname=' + vm.data.surname + '&soundex=' + vm.soundex;
			var i;

			SearchService.getNames(query)
           	.then(function successCallback(response) {
  				if (response.status===200) {
 					vm.theData = response.data.names;
 					vm.setFocus2 = true;
					vm.setFocus1 = true;
					vm.tableParams.reload();
					for(i=0;i<UtilityFactory.getLength(vm.theData);i++) {
						if(Gparams.personID === vm.theData[i].mainID) vm.selectedRow = i;
					}

                } else {
					UtilityFactory.showAlertToast('<md-toast>The search change for people named' + vm.surname +
						' failed with the error:' + response.data.error + '.' + vm.appName +
						' has been notified</md-toast>');
					UtilityFactory.sendBugReport(response);
               }
        	});
        }

        vm.returnToStart = function() {
			$state.go(vm.fromPage, {obj:{tab:vm.tab}});
 		};

	}
})();