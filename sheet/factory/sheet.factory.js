// updated 1/12/17, passed testing

(function () {
    'use strict';

 angular
    .module('root')
    
    .factory('SheetFactory', function($rootScope, $state, $filter, UtilityFactory, SheetService, SheetSliderService, Gparams) {

    	var _leftPerson;
 		var _middlePerson;
		var _rightPerson;
		var _blankPerson;
		var fullData;

		_blankPerson = {
				gender 				: '',
				birth 				: '',
				birthCity 			: '',
				birthCountry 		: '',
				birthCounty 		: '',
				birthLocation 		: '',
				birthState 			: '',
				blurIt 	 			: '',
				death	 			: '',
				deathCity			: '',
				deathCountry		: '',
				deathCounty			: '',
				deathLocation		: '',
				deathState			: '',
				fullName			: '',
				givenName			: '',
				mainID				: '',
				middleName			: '',
				namePrefix			: '',
				nameSuffix			: '',
				surname				: '',
				showPerson			: false,				// set to false so the person card is hidden if no one is selected
				startDate			: '',
				endDate				: '',
				spouses				: '',
				parents				: '',
				children			: '',
				curSpouse			: '',
				curFather			: '',
				curMother			: ''
			};	

    	function _setCredentials(theData) {         
			Gparams.curUserID = theData.mainID;
            Gparams.personID = theData.mainID;
            Gparams.mainDisabled = false;
    	}
       
		function _setMiddlePerson() {	
			try {										// try/catch to handle bad inputs during initialization
				var theDate = SheetSliderService.getSlider();
				var rightID = _rightPerson.mainID;
				var startInUNIX;
				var children = [];
				
				children = $filter('filter')(_leftPerson.children, {spouseID:rightID}, true);
					
				_middlePerson = $filter('filter')(children, function(value) {									// next, filter children list by birth date
					startInUNIX = new Date(value.birth).valueOf();	
					if(theDate > startInUNIX) return true;
					return false;
				});
			} catch(err) {}	
			return _middlePerson;	
		}
		
		function _updatePerson() {	
			var theDate = SheetSliderService.getSlider();
				
			// include other updateable values here, such as name, parents, etc.

/*			ids.person1 = _leftPerson.mainID;
			vm.ids.father1 = _leftPerson.fathers[_leftPerson.curFather].mainID;
			vm.ids.mother1 = _leftPerson.mothers[_leftPerson.curMother].mainID;
			vm.ids.person2 = _rightPerson.mainID;
			vm.ids.father2 = _rightPerson.spouses[_leftPerson.curSpouse].fathers[_rightPerson.curFather].mainID;
			vm.ids.mother2 = _rightPerson.spouses[_leftPerson.curSpouse].mothers[_rightPerson.curMother].mainID;
*/			

		}
		
		function _setRightPerson() {
			var theDate = SheetSliderService.getSlider();
			var startInUNIX;
			var endInUNIX;
			var tmp = {};

			tmp =  $filter('filter')(_leftPerson.spouses, function(who) {
				startInUNIX = new Date(who.startDate).valueOf();
				endInUNIX = new Date(who.endDate).valueOf();
				if(UtilityFactory.between(startInUNIX, endInUNIX, theDate)) {
					return true;
				} else {
					return false;
				} 
			});

			if(angular.isObject(tmp)) {
				_rightPerson = tmp[0];
			} else {
				_rightPerson = _blankPerson;
			}
				

		}
 
		return {

// public functions
	       
      	    
		updatePerson: function(person) {
			_updatePerson(person);
		},

		getBlankPerson: function() {
			return _blankPerson;
		},
		
		setBlankPerson: function() {
			_blankPerson = _blankPerson();

		},

		getLeftPerson: function() {
			return _leftPerson;
		},
	
		getRightPerson: function() {
			return _rightPerson;
		},
		
		disableRightSpouse: function(id) {
			try {
				if(id == _leftPerson.mainID) return true;
			return false;
            } catch (err) {
                return true
            }
        },
		
		disableLeftSpouse: function(id) {
			try {
				if(id == _rightPerson.mainID) return true;
			return false;
            } catch (err) {
                return true
            }
        },
		
		getMiddlePerson: function() {
			return _middlePerson;
		},
		
		setMiddlePerson: function() {
			_middlePerson = _setMiddlePerson();					

		},
	
		initSheet: function(id) {
			 	return SheetService.getFamily(id)
				.then(function successCallback(response) {
					fullData = response.data;
					if (response.status=="200") {
						_leftPerson = fullData.person;
						_rightPerson = _leftPerson.spouses[_leftPerson.curSpouse];
						SheetSliderService.initSlider(_leftPerson);
					}

					_setMiddlePerson();
					_updatePerson();
					
					return response;
		 	 });			 	 
		},
		
		setLeftPerson: function(person) {
			var theDate = SheetSliderService.getSlider();
			var startInUNIX;
			var endInUNIX;
			var tmp = {};

			if(angular.isNumber(person)) {												// if who is undefined, then this is an update spouse situation
				alert(typeof person);
				var newDate = new Date(_rightPerson.spouses[person].startDate).valueOf() + 1000;
				_leftPerson = _rightPerson.spouses[person];
				if(_leftPerson.living) {
					SheetSliderService.setSlider(Date.now().valueOf());	
				} else {
					SheetSliderService.setSlider(new Date(_leftPerson.death).valueOf());	
				}
			
			} else if(angular.isUndefined(person)) {										// if who is undefined, then this is an update due to slider change
				person = _leftPerson;
				tmp =  $filter('filter')(person.spouses, function(who) {
					startInUNIX = new Date(who.startDate).valueOf();
					endInUNIX = new Date(who.endDate).valueOf();
					if(isFinite(endInUNIX) && UtilityFactory.between(startInUNIX, endInUNIX, theDate)) {
						return true;
					} else if(!isFinite(endInUNIX) && startInUNIX <= theDate) {
						return true;
					} else {
						return false;
					} 
				});
				if(angular.isObject(tmp)) {
					_leftPerson = tmp[0];
				} else {
				_leftPerson = _blankPerson;
				}
				
			} else {
					_leftPerson = person;
			}
			
			_setMiddlePerson();		
			
			_leftPerson.doBlur = false;

		},


		setRightPerson: function() {
			_setRightPerson();

		},

		
	};
    })
})();