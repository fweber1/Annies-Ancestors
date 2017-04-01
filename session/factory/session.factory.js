// updated 1/12/17, passed testing

(function () {
    'use strict';

 angular
    .module('root')
    
    .factory('SessionFactory', function($state, UtilityFactory, Gparams) {

    	var _theCode;
    	var _regData;
    	var vm = this;
    	vm.params = Gparams;
    	
    	function _setCredentials(theData) {         
			Gparams.curUserID = theData.mainID;
            Gparams.personID = theData.mainID;
            Gparams.mainDisabled = false;
			Gparams.canSave = true;
    	}
  	
		return {

// public functions
	       
			doGuest: function() {
		        UtilityFactory.showTemplateToast('<md-toast>Welcome to ' + Gparams.appName + ' as a guest.</md-toast>');
		        _setCredentials(params.guestID);
				Gparams.curUserID = params.guestID;
    			Gparams.canSave = false;
    			Gparams.mainDisabled = false;
				UtilityFactory.getNameHistory(Gparams.guestName);
				$state.go('guest');
			},

			logout: function() {
	  			Gparams.mainDisabled = true;
				Gparams.canSave = true;
				$('#myDialogContent').html('');									// remove name in history
				$state.go('login');
			},

			doRegister: function() {
				$state.go('register1');
       		},

 			doEmail: function() {
 				$state.go('email');
			},

 			doPassword: function() {
 				$state.go('password');
			},

 			doHome: function() {
 				$state.go('home');
			},
		
	        setCredentials: function(theData) {
	        	_setCredentials(theData);
	        },

			getRegData: function() {
				return _regData;
			},
		       
			setRegData: function(theData) {
				_regData = theData;
			},
	  		
			getTheCode: function() {
				return _theCode;
			},
		       
			setTheCode: function(theData) {
				_theCode = theData;
			},

		};
		
	});
})();