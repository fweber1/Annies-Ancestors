angular
.module('root')

	.filter('getUnique', function() {
		return function (theArray) {
			 var arr = [];
			 var noMatch;
			 	angular.forEach(theArray, function(item) {
			 		noMatch = true;
                    angular.forEach(arr, function (itm) {
                        if(item == itm) noMatch = false;
				});
				if(noMatch) arr.push(item);
			});
	 		return arr; 
		};
 	})

	.filter('excludeItemsByID', function () {
		return function (items, excludedList) {
		var ret = [];
		angular.forEach(items, function (item) {
			angular.forEach(excludedList, function (itm) {
				if (itm == item.mainID) {
					ret.push(item);
				}
			});
		});
		return ret;
		};
	})

	.filter('empty', function() {
		return function(array) {
			var filteredArray = [];
				angular.forEach(array, function(item) {
				if (item) filteredArray.push(item);
				});
			return filteredArray;
		 };
	})
	
	.filter('startsWith', function() {
		return function(actual, expected) {
		 var lowerStr = (actual + "").toLowerCase();
		return lowerStr.indexOf(expected.toLowerCase()) === 0;
		}
	});
