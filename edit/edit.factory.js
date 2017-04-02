// updated 1/12/17, passed testing

(function () {
    'use strict';

 angular // jshint ignore:line
    .module('root')

    .factory('EditFactory', function() {

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
			}

		};

	});
})();