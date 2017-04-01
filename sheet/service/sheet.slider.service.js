(function () {
    'use strict';
	
	angular	
        .module('root')
        .factory('SheetSliderService', SheetSliderService);

	    SheetSliderService.$inject = ['UtilityFactory'];
	   	function SheetSliderService(   UtilityFactory) {
			
	 		var _slider;  
			var _sliderMin;		
			var _sliderMax;	
		
			return {
									
	       		getSliderMin: function() {
	        		return _sliderMin;
	        	},
				 
		       	setSliderMin: function(value) {
	        		_sliderMin = value;

	        	},
	        	
	       		getSlider: function() {
	        		return _slider;
	        	},
				 
		       	setSlider: function(value) {
		       		if(value!='N/A' && value!=NaN) {
	        			_slider = value;
	        		} else {
	        			_slider = _sliderMax;
	        		}

	        	},
	         				       
	        	getSliderMax: function() {
	        		return _sliderMax;
	        	},
	        	
	        	setSliderMax: function(value) {
	        		_sliderMax = value;

	        	},
	
				initSlider: function(person) {
					if(person.living) {
						_sliderMax = new Date().valueOf();
					} else {
						_sliderMax = new Date(person.death).valueOf();
					}
	     			_sliderMin = new Date(person.birth).valueOf();
	     			_slider = _sliderMax;
	 	 			UtilityFactory.getTodayInHistory();
				}
			}

		}
})();
