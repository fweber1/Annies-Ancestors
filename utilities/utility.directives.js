angular
.module('root')

	.directive('stickyFooter111111', function($timeout) {	
			return {	
		restrict: 'A',																	// add class 'firstInput' to the input to receive focus
		link: function($scope, $element, $attr) {
				$scope.$watch($attr.stickyFooter,											// watchers on $scope are automatically removed when $scope is destroyed
	function (_focusVal) {
	$timeout( function () {
				var windowHeight = angular.element(window).height();
				var footerHeight = $element.height();
							$element.css('top', windowHeight - footerHeight + 45);
		});
		}
				)
			}};
			
			angular.element(window).off("resize").on("resize", function() {
				$scope.$broadcast('content.loaded');
			});

			$scope.$on('content.loaded', function() {
	var windowHeight = angular.element(window).height();
	var footerHeight = angular.element('#footer').height();
				 angular.element('#footer').css('top', windowHeight - footerHeight + 45);
			})	
 })
	
		.directive('focusOnShow', function($timeout) {											// directive to set focus after ng-show runs
		return {																			// put focus-on-show="vm.toggle" attribute on ng-show
		restrict: 'A',																	// add class 'firstInput' to the input to receive focus
		link: function($scope, $element, $attr) {
 				$scope.$watch($attr.focusOnShow,											// watchers on $scope are automatically removed when $scope is destroyed
	function (_focusVal) {
	$timeout( function () {
	var inputElement = $element.is('input')
	? $element
	: $element.find('.firstInput');
	 if(_focusVal) {
	 	 inputElement.focus();
	 inputElement.select();
	 } else {
	 inputElement.blur();
	 }
	});
	}
)
		
		}
		};
		})		
				
 		.directive('focus', function($timeout, $parse) {										// directive to set focus on labeled input 
		return {																			// put focus="vm.toggle" attribute on input tag to be focused
		restrict: 'A',
		link: function(scope, element, attrs) {
		scope.$watch(attrs.focus, function(newValue, oldValue) {
		if (newValue) { element[0].focus(); }
		});
		element.bind("blur", function(e) {
		$timeout(function() {
		scope.$apply(attrs.focus + "=false"); 
		}, 0);
		});
		element.bind("focus", function(e) {
		$timeout(function() {
					scope.$apply(attrs.focus + "=true");
		}, 0);
		})
		}
		}
		})

 		.directive('backImgComm', function($http, $q) {
		return {
		restrict: 'A',
		link: function(scope, element, attrs) {
		attrs.$observe('backImgComm', function(value) {
			scope.value = value;
		$http.get('/sheet/profilePhotos/' + scope.value + '.jpeg')
			.then(function(response){
			element.attr('src', '/sheet/profilePhotos/' + scope.value + '.jpeg');
						}, function errorCallback(response) {
			 				$q.reject(response);														// See: http://davidcai.github.io/blog/posts/angular-promise/
		element.attr('src', '/sheet/profilePhotos/missing.jpeg');
 					})
				});
			}}
		})
 	
		.directive('droppable', function() {									/* for details on dnd directives: https://parkji.co.uk/2013/08/11/native-drag-and-drop-in-angularjs.html */
			return {
				scope: {
			 		drop: '&',
					user: '='
				},
				
				link: function(scope, element) {
					var el = element[0];
			
			 		var dragoverL = el.addEventListener('dragover',
						function(e) {
 					e.dataTransfer.dropEffect = 'move';
 						this.classList.add('over');
					if (e.preventDefault) e.preventDefault();
					 return false;
					}, false
				);
			
			 	 var dragenterL = el.addEventListener('dragenter',
				function(e) {
 						this.classList.add('over');
					return false;
				}, false
				);
			
					var dragleaveL = el.addEventListener('dragleave',
						function(e) {
 						this.classList.remove('over');
							return false;
						}, false
					);
			
				var dropL = el.addEventListener('drop',
						function(e) {
 						this.classList.remove('over');
 						if (e.stopPropagation) e.stopPropagation();
						var tmp = document.getElementById(e.srcElement.parentElement.id);
						item = e.dataTransfer.getData('text/plain');
						tmp.appendChild(item[4]);
						scope.$apply(function(scope) {
						var fn = scope.drop();
						if (angular.isDefined(fn)) fn(item);
						});
					return false;
				}, false
					);
			}
			}		
		})
		
		.directive('draggable', function() {
			return function(scope, element) {
		var el = element[0];
		el.draggable = true;
				
		var dragstartL = el.addEventListener('dragstart',
				function(e) {
			e.dataTransfer.effectAllowed = 'move';
			e.dataTransfer.setData('text/plain', this.id);
			this.classList.add('drag');
			 return false;
				}, false
			);

		var dragendL = el.addEventListener('dragend',
		 		function(e) {
		 			this.classList.remove('drag');
			 		return false;
				}, false
			);
			};
		});

