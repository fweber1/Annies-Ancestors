// updated 1/12/17, passed testing

(function () {
    'use strict';

 angular
    .module('root')
    
    .factory('AddFactory', function($state, UtilityFactory, Gparams) {

    	var _curPerson;
    	var _createdList;
    	var _theData;
    	   	
		return {

// public functions
	       	   		
			setCreatedList: function(theList) {
				_createdList = theList;
			},

			getCreatedList: function() {
				return _createdList;
			},
		       
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