 // updated 1/12/17, still in testing

(function () {    'use strict';

    angular
        .module('root')
 
    	.filter('unique', function() {
		    return function (arr, field) {
			    var o = {}, i, l = arr.length, r = [];
			    for(i=0; i<l;i+=1) {
					o[arr[i][field]] = arr[i];
			    }
			    for(i in o) {
					r.push(o[i]);
			    }
			    return r;
			}
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
})();
