// updated 1/12/17, still in testing

(function () {    'use strict';

    angular
        .module('root')
/*		.directive('backImg', function() {
	     	return function(scope, element, attrs) {
	    		attrs.$observe('backImg', function(value) {
	    			if(value == "") {value = "missing";}
		    		value = "/sheet/profilePhotos/" + value + ".jpeg";
	  	            element.css({
		                'background-image'	: 'url(' + value +')',
		                'class'				: 'bigLeftProfile'
				});
			});
		}
		})
*/	
		
// ng-class="{textFit:true, private:vm.leftPerson.doBlur}" "
		.directive('aName', function($compile) {
	     	return {
	     		restrict: 'EA',
	     	    scope: {
		        	theid:    '@theid',
		        	callback: "&"  
		        },
//		        template: "<div ng-click='callback(data)'>test</div>", 
		        link: function(scope, el) {
		        	$(el[0].firstElementChild).attr('onclick', 'showDetails()');				// wrap el[0].firstElementChild in $() to get DOM element reference
			          var fn = $compile(el.contents())(scope);
			          console.log(scope.theid)
//			          scope.callback = scope.callback(); 
	
//			          scope.data = scope.theid;
//			          console.log(scope.data)
	
//			          el.unbind('click').bind("click",function() {
//			        	scope.$apply(function() {
//			        		scope.callback(scope.data);  
//			        	});
//			     	});
		        }
	     	}
		})
})();

