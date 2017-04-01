// updated 1/12/17, passed testing

(function () {
    'use strict';

 angular
    .module('root')
    
    .factory('EditFactory', function($state, UtilityFactory, Gparams) {

    	var _curPerson;
    	var _theData;   	
  	
		return {

// public functions
	       
			getCurPerson: function() {
				return _curPerson;
			},
		       
			setCurPerson: function(person) {
				_curPerson = person;
			},
			
			getData: function() {
				return _theData;
			},
		       
			setData: function(theData) {
				_theData = theData;
			},

		}
		
	});
})();