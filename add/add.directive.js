   angular
     .module('root')

	.directive('file', function () {
    	return {
    		scope: {
    		file: '='
    	},
        link: function (scope, el, attrs) {
            unsubscribe.el.bind('change', function (event) {
                var file = event.target.files[0];
                scope.file = file ? file : undefined;
            });
	        el.on('$destroy', function() {
				angular.element(el).off('change', unsubscribe);           
			});
        }
        }
        })

		.directive('dragall', function() {
			return function(scope, element) {
			var el = element[0];
			el.draggable = true;

			var dragstartL = el.addEventListener('dragstart',
				function(e) {
					var theValues;
					var tmp;
					var theType;
					var style;
					var theLoc;
					
					e.dataTransfer.effectAllowed = 'copy';
					tmp = this.getAttribute('thedata').split(',');
					tmp[4] = this.id;
					theType = tmp[0];
					e.stopPropagation();
					if(theType == 'name') {
						theValues = tmp;
					} else if(theType == 'page') {
			   		    style = window.getComputedStyle(event.target, null);
			   		    theLoc = (parseInt(style.getPropertyValue("left"),10) - event.clientX) + ',' + (parseInt(style.getPropertyValue("top"),10) - event.clientY);
						theValues = theType + ',' + theLoc + ',' + this.id;
					} else if(theType == 'family') {
				        theValues = this.id;
					}
					e.dataTransfer.setData('text/plain', theValues);
					this.classList.add('drag');
					return false;
					},false
				);			
	
				var dragendL = el.addEventListener('dragend',
			 		function(e) {
			 			this.classList.remove('drag');
				 		return false;
					}, false
				);
			};
			})

		.directive('dropall', function() {									/* for details on dnd directives: https://parkji.co.uk/2013/08/11/native-drag-and-drop-in-angularjs.html */
			return {
				scope: {
					  drop: '&',
					  bin: '=' 
					},
					
				link: function(scope, element) {
					var el = element[0];
			
			 		var dragoverL = el.addEventListener('dragover',
						function(e) {
				 			e.dataTransfer.dropEffect = 'copy';
	 						if (e.preventDefault) e.preventDefault();
	 						return false;
			 			}, false
			 		);
			
				 	var dragenterL = el.addEventListener('dragenter',
						function(e) {
	 						return false;
				 		}, false
				 	);
			
					var dragleaveL = el.addEventListener('dragleave',
						function(e) {// 							this.classList.remove('over');
							return false;
						}, false
					);
			
					var dropL = el.addEventListener('drop',
						function(e) {
							var theName = "";
	 						if (e.stopPropagation) e.stopPropagation();
	 						var theValues = e.dataTransfer.getData("text/plain").split(',');
	 						var theType = theValues[0];
	 						if(theType == 'name') {
	 							var theID = theValues[2];
	 							var theName = theValues[1];
	 							$("#" + el.id).text(theValues[1]);
/*		 						try {
									if(theParent.id.substring(0,7) == "curUser") {
										var newChild = $("#" + theValues[3]);
										console.log(el)
										var oldChild = el;				 						
										oldChild.appendChild(newChild[0], oldChild.childNodes[0]);
		 							}
								} catch(err) {}
*/								
							} else if(theType == 'page') {
		  						var offsetx = theValues[1];
		  						var offsety = theValues[2];
		 						var theID 	= theValues[3];
		 			   		    var dm = document.getElementById(theID);
	 	 			   		    dm.style.left = (event.clientX + parseInt(offsetx,10)) + 'px';
	 	 			   		    dm.style.top = (event.clientY + parseInt(offsety,10)) + 'px';
	 	 			   		    event.preventDefault();
	 						} else if(theType == 'family'){
	 							var tmp = document.getElementById(e.srcElement.id);
		 						var item = document.getElementById(e.dataTransfer.getData('Text'));
		 						var theID = item.id;
								tmp.appendChild(item);
							}
	 						var binID = this.id;
	 						scope.$apply(function(scope) {
	 						    var fn = scope.drop();
	 						    if ('undefined' !== typeof fn) {
	 						      fn(theID, theName);
	 						    }

								}, false
							);
					})
				}
			}
					
		})

.directive('angularTrix', function() {
        return {
            restrict: 'A',
            require: 'ngModel',
            scope: {
                trixInitialize: '&',
                trixChange: '&',
                trixSelectionChange: '&',
                trixFocus: '&',
                trixBlur: '&',
                trixFileAccept: '&',
                trixAttachmentAdd: '&',
                trixAttachmentRemove: '&'
            },
            link: function(scope, element, attrs, ngModel) {

                element.on('trix-initialize', function() {
                    if (ngModel.$modelValue) {
                        element[0].editor.loadHTML(ngModel.$modelValue);
                    }
                });

                ngModel.$render = function() {
                    if (element[0].editor) {
                        element[0].editor.loadHTML(ngModel.$modelValue);
                    }

                    element.on('trix-change', function() {
                        ngModel.$setViewValue(element.html());
                    });
                };

                var registerEvents = function(type, method) {
                    element[0].addEventListener(type, function(e) {
                        if (type === 'trix-file-accept' && attrs.preventTrixFileAccept === 'true') {
                            e.preventDefault();
                        }
                        scope[method]({
                            e: e,
                            editor: element[0].editor
                        });
                    });
                };

                registerEvents('trix-initialize', 'trixInitialize');
                registerEvents('trix-change', 'trixChange');
                registerEvents('trix-selection-change', 'trixSelectionChange');
                registerEvents('trix-focus', 'trixFocus');
                registerEvents('trix-blur', 'trixBlur');
                registerEvents('trix-file-accept', 'trixFileAccept');
                registerEvents('trix-attachment-add', 'trixAttachmentAdd');
                registerEvents('trix-attachment-remove', 'trixAttachmentRemove');

            }
        };
    });
    
 