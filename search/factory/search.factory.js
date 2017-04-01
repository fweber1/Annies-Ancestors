// updated 1/12/17, passed testing

(function () {
    'use strict';

 angular
    .module('root')
    
    .factory('SearchFactory', function() {

		var _searchTerm;
		var _showReturn;
		var _oldPerson;
		var _fromPage;
		var _fromTab;
		var _step;
		
		return {

// public functions
	       
			setFromTab: function(tab) {
				_fromTab = tab;
			},

			getFromTab: function() {
				return _fromTab;
			},
			
			setStep: function(step) {
				_step = step;
			},

			getStep: function() {
				return _step;
			},
			
			setFromPage: function(page) {
				_fromPage = page;
			},

			getFromPage: function() {
				return _fromPage;
			},
			
			setSearchTerm: function(who) {
				_searchTerm = who;
			},

			getSearchTerm: function() {
				return _searchTerm;
			},
			
			setOldPerson: function(who) {
				_oldPerson = who;
			},

			getOldPerson: function() {
				return _oldPerson;
			},
			
			setReturn: function(state) {
				_showReturn = state;
			},

			getReturn: function() {
				return _showReturn;
			}
		}
	});
})();