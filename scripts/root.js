/* ******************************************************

 Root Controller

  ToDo:
  
  in php, add a watermark before showing picture if not the owner viewing it
  as option, prevent download of pictures
  in php, change all uploaded images to png to simplify later programming
  in php, validate images aren't malware as per: http://security.stackexchange.com/questions/26690/use-php-to-check-uploaded-image-file-for-malware

 ******************************************************
*/

var app = angular
	.module('root', ["ngTable", 'ngMaterial', 'ngMessages', 'ct.ui.router.extras', 'ngCookies', 'angAccordion', 'ui.calendar', 'ui.bootstrap', 'ui.router', 'mdo-angular-cryptography', 'ngResource'])

	.run(function ($rootScope, $state) {
		$rootScope.$state = $state;
		$rootScope.rs = {};
		$rootScope.rs.addSelectedTab = 0;
		$rootScope.rs.editSelectedTab = 0;
		$rootScope.data = 0;
	})

	
	.config(function($mdThemingProvider, $stateProvider, $stickyStateProvider, $urlRouterProvider, $locationProvider, $cryptoProvider) {	
	    $cryptoProvider.setCryptographyKey('ABCD123');	
	    	    
		$urlRouterProvider.otherwise('/login');
//		$stickyStateProvider.enableDebug(true);

   		$stateProvider	
			.state("app", {
			    url: '', 
			    views: {
			       '@': {
			    	   templateUrl: '/index.html',
			    	   controller : 'root as vm'			        
			       },
			       'header@': {
			    	   templateUrl: '/header.html',
			       },
			       'footer@': {
			    	   templateUrl: '/footer.html',
			       },
					params: {
						  Gparams: {
							currentDate	: (new Date()),
							guestID		: 6120,
							curPersonID	: 6120,
							defaultID	: 6120,
							curUserID	: 6120,
							debug		: false,
							currentYear	: (new Date()).getFullYear(),
							appName		: "Annie's Ancestors",
							mainDisabled: true,
							homeLink	: false,
							showCalendar: false,
							canSave		: true																// remove for production
						  }
					}
			    },
			    resolve: {
			    }
		    })
		    			     				
			.state('login', {
				parent: 'app',
				url: '/login',
				views: {
				    "main@": {
						templateUrl: 'session/login/login.view.html',
						controller: 'LoginController as vm'						
				    },
			        "theForm@login": {
						templateUrl: 'session/templates/login.html',
						controller: 'LoginController as vm'
			        }
				}
			})
						
			.state("guest", {
				parent: 'app',
				url: '/guest',
				views: {
				    "main@": {
						controller	: 'GuestController',
						templateUrl : "session/guest/guest.view.html",
				    }
				}
			})

 			.state('register', {
				parent: 'app',
				url: '/register',
				views: {
				    "main@": {
						controller	: 'Register1Controller as vm',
						templateUrl : "session/register/register1.view.html",
				    }
				},
			})

 			.state('registerCode', {
				parent: 'register',
				url: '/code',
				views: {
				    "main@": {
						controller	: 'Register2Controller as vm',
						templateUrl : "session/register/register2.view.html",
				    }
				}
			})
			
			.state('registerPswd', {
				parent: 'register',
				url: '/pswd',
				views: {
				    "main@": {
						controller	: 'Register3Controller as vm',
						templateUrl : "session/register/register3.view.html",
				    }
				}
			})
		
			.state('email', {
				parent: 'app',
				url: '/email',
				views: {
				    "main@": {
						templateUrl: 'session/email/email1.view.html',
						controller: 'Email1Controller as vm'						
				    },
			        "login@email": {
						templateUrl: 'session/templates/login.html',
						controller: 'Email1Controller as vm'
			        }
				}
			})

			.state('changeEmail', {
				parent: 'email',
				url: '/change',
				views: {
				    "main@": {
						controller	: 'Email2Controller as vm',
						templateUrl : "session/email/email2.view.html",
				    }
				}
			})
				
			.state('password', {
				parent: 'app',
				url: '/password',
				views: {
				    "main@": {
						controller	: 'Password1Controller as vm',
						templateUrl : 'session/password/password1.view.html',
				    }
				}
			})
	
			.state('passwordCode', {
				parent: 'password',
				url: '/code',
				views: {
				    "main@": {
						controller	: 'Password2Controller as vm',
						templateUrl : 'session/password/password2.view.html',
				    }
				}
			})
	
			.state('passwordChange', {
				parent: 'password',
				url: '/change',
				views: {
				    "main@": {
						controller	: 'Password3Controller as vm',
						templateUrl : 'session/password/password3.view.html',
				    }
				}
			})

			.state('home', {
				parent: 'app',
				url: '/home',
				views: {
				    "main@": {
						controller	: 'HomeController as vm',
						templateUrl : "session/home/home.view.html",
				    }
				}
			})
			
			.state("album", {
				parent: 'app',
				url: '/album',
				views: {
				    "main@": {
						controller  : 'AlbumController as vm',
						templateUrl : "album/album.view.html",
				    }
				}
			})
			
			.state("search", {
				parent: 'app',
				url: '/search',
				params: { obj: {}},
				views: {
				    "main@": {
						controller  : 'SearchController as vm',
						templateUrl : "search/search.view.html",
				    }
				}
			})

			.state('add', {
				abstract: true,
				parent: 'app',
				sticky: true,
				deepStateRedirect: true,
				params: {obj: null},
				url: '/add',
				views: {
				    "main@": {
						controller  : 'AddController as vm',
						templateUrl : 'add/add.view.html',
				    }
				}
			})

			.state('addName', {
				parent: 'add',
				url: '/name/',
				deepStateRedirect: true,
			      views: {
					'addName@add': {
						controller  : 'AddNameController as vm',
						templateUrl : 'add/templates/name.view.html',
					},
					'nameNames@addName': {
						templateUrl : 'add/templates/names.view.html',
					},
					'nameButtons@addName': {
						templateUrl : 'add/templates/buttons.view.html',
					},
					'nameCreatedList@addName': {
						templateUrl : 'add/templates/createdList.view.html'
					}
				},
			})

			.state('addEvents', {
				parent: 'add',
				url: '/events/',
				deepStateRedirect: true,
					views: {
					'addEvents@add': {
						controller  : 'AddEventController as vm',
						templateUrl : 'add/templates/event.view.html',
					},
					'eventDates@addEvents': {
						templateUrl : 'add/templates/date.input.view.html',
					},
					'eventPlaces@addEvents': {
						templateUrl : 'add/templates/place.input.view.html',
					},
					'eventButtons@addEvents': {
						templateUrl : 'add/templates/buttons.view.html',
					},
					'eventCreatedList@addEvents': {
						templateUrl : 'add/templates/createdList.view.html'
					}
				}
			})

			.state('addAttributes', {
				parent: 'add',
				url: '/attributes/',
				views: {
					'addAttributes@add': {
						controller  : 'AddAttributeController as vm',
						templateUrl : 'add/templates/attribute.view.html',
					},
					'attributeDates@addAttributes': {
						templateUrl : 'add/templates/date.input.view.html',
					},
					'attributePlaces@addAttributes': {
						templateUrl : 'add/templates/place.input.view.html',
					},
					'attributeButtons@addAttributes': {
						templateUrl : 'add/templates/buttons.view.html',
					},
					'attributeCreatedList@addAttributes': {
						templateUrl : 'add/templates/createdList.view.html'
					}
				}
			})

			.state('addMarriages', {
				parent: 'add',
				url: '/marriages/',
				views: {
					'addMarriages@add': {
						controller  : 'AddMarriageController as vm',
						templateUrl : 'add/templates/marriage.view.html',
					},
					'marriageDates@addMarriages': {
						templateUrl : 'add/templates/date.input.view.html',
					},
					'marriagePlaces@addMarriages': {
						templateUrl : 'add/templates/place.input.view.html',
					},
					'marriageButtons@addMarriages': {
						templateUrl : 'add/templates/buttons.view.html',
					},
					'marriageCreatedList@addMarriages': {
						templateUrl : 'add/templates/createdList.view.html'
					}
				}
			})

			.state('addStories', {
				parent: 'add',
				url: '/stories/',
				views: {
					'addStories@add': {
						controller  : 'AddStoryController as vm',
						templateUrl : 'add/templates/stories.view.html',
					},
					'storiesButtons@addStories': {
						templateUrl : 'add/templates/buttons.view.html',
					},
					'storyCreatedList@addStories': {
						templateUrl : 'add/templates/createdList.view.html'
					}
				}
			})

			.state('addMedia', {
				parent: 'add',
				url: '/media/',
				views: {
					'addMedia@add': {
						controller  : 'AddMediaController as vm',
						templateUrl : 'add/templates/media.view.html',
					},
					'mediaButtons@addMedia': {
						templateUrl : 'add/templates/buttons.view.html',
					},
					'mediaCreatedList@addMedia': {
						templateUrl : 'add/templates/createdList.view.html'
					}
				}
			})

			.state('addFamily', {
				parent: 'add',
				url: '/family',
				views: {
					'addFamily@add': {
						controller  : 'AddFamilyController as vm',
						templateUrl : 'add/templates/family.view.html',
					},
					'familyButtons@addFamily': {
						templateUrl : 'add/templates/buttons.view.html',
					},
					'familyCreatedList@addFamily': {
						templateUrl : 'add/templates/createdList.view.html'
					}
				}
			})
			
			.state('sheet', {
				parent: 'app',
				url: '/sheet/',
				deepStateRedirect: true,
				params: {obj: null},
			    views: {
					'main@': {
						templateUrl : 'sheet/sheet.view.html',
						controller  : 'SheetController as vm'
					},
					'leftPanel@sheet': {
						templateUrl : 'sheet/templates/leftPanel.view.html',
					},
					'middleTopPanel@sheet': {
						templateUrl : 'sheet/templates/middle.top.view.html',
					},
					'middleMiddlePanel@sheet': {
						templateUrl : 'sheet/templates/middle.middle.view.html',
					},
					'middleBottomPanel@sheet': {
						templateUrl : 'sheet/templates/middle.bottom.view.html',
					},
					'rightPanel@sheet': {
						templateUrl : 'sheet/templates/rightPanel.view.html',
					},
					'sliderPanel@sheet': {
						templateUrl : 'sheet/templates/slider.view.html',
					}
				}
			})
						
			.state('edit', {
				abstract: true,
				parent: 'app',
				sticky: true,
				deepStateRedirect: true,
				params: {obj: null},
				url: '/edit',
				views: {
				    "main@": {
						controller  : 'EditController as vm',
						templateUrl : 'edit/edit.view.html',
				    }
				}
			})

			.state('editName', {
				parent: 'edit',
				url: '/name/',
				sticky: true,
				deepStateRedirect: true,
				params: {obj: null},
				views: {
					'editName@edit': {
						controller  : 'EditNameController as vm',
						templateUrl : 'edit/templates/name.view.html',
					},
					'editNameNames@editName': {
						templateUrl : 'edit/templates/names.view.html',
					},
					'editNameButtons@editName': {
						templateUrl : 'edit/templates/buttons.view.html',
					},
					'editNameInuseList@editName': {
						templateUrl : 'edit/templates/inuse.view.html',
					},
					'editNameShowEmail@editName': {
						templateUrl : 'edit/templates/email.view.html',
					},
				},
			})

			.state('editEvents', {
				parent: 'edit',
				url: '/events/',
				deepStateRedirect: true,
				params: {obj: null},
					views: {
					'editEvents@edit': {
						controller  : 'EditEventController as vm',
						templateUrl : 'edit/templates/event.view.html',
					},
					'editEventDates@editEvents': {
						templateUrl : 'edit/templates/date.input.view.html',
					},
					'editEventPlaces@editEvents': {
						templateUrl : 'edit/templates/place.input.view.html',
					},
					'editEventButtons@editEvents': {
						templateUrl : 'edit/templates/buttons.view.html',
					},
					'editEventsInuseList@editEvents': {
						templateUrl : 'edit/templates/inuse.view.html',
					},
					'editEventsShowEmail@editEvents': {
						templateUrl : 'edit/templates/email.view.html',
					},
				}
			})

			.state('editAttributes', {
				parent: 'edit',
				url: '/attributes/',
				deepStateRedirect: true,
				params: {obj: null},
				views: {
					'editAttributes@edit': {
						controller  : 'EditAttributeController as vm',
						templateUrl : 'edit/templates/attribute.view.html',
					},
					'editAttributesDates@editAttributes': {
						templateUrl : 'edit/templates/date.input.view.html',
					},
					'editAttributesPlaces@editAttributes': {
						templateUrl : 'edit/templates/place.input.view.html',
					},
					'editAttributesButtons@editAttributes': {
						templateUrl : 'edit/templates/buttons.view.html',
					},
					'editAttributesInuseList@editAttributes': {
						templateUrl : 'edit/templates/inuse.view.html',
					},
					'editAttributesShowEmail@editAttributes': {
						templateUrl : 'edit/templates/email.view.html',
					},
				}
			})

			.state('editMarriages', {
				parent: 'edit',
				url: '/marriages/',
				deepStateRedirect: true,
				params: {obj: null},
				views: {
					'editMarriages@edit': {
						controller  : 'EditMarriageController as vm',
						templateUrl : 'edit/templates/marriage.view.html',
					},
					'editMarriagesDates@editMarriages': {
						templateUrl : 'edit/templates/date.input.view.html',
					},
					'editMarriagesPlaces@editMarriages': {
						templateUrl : 'edit/templates/place.input.view.html',
					},
					'editMarriagesButtons@editMarriages': {
						templateUrl : 'edit/templates/buttons.view.html',
					},
					'editMarriagesInuseList@editMarriages': {
						templateUrl : 'edit/templates/inuse.view.html',
					},
					'editMarriagesShowEmail@editMarriages': {
						templateUrl : 'edit/templates/email.view.html',
					},
				}
			})

			.state('editStories', {
				parent: 'edit',
				url: '/stories/',
				deepStateRedirect: true,
				params: {obj: null},
				views: {
					'editStories@edit': {
						controller  : 'EditStoryController as vm',
						templateUrl : 'edit/templates/story.view.html',
					},
					'editStoriesButtons@editStories': {
						templateUrl : 'edit/templates/buttons.view.html',
					},
					'editStoriesInuseList@editStories': {
						templateUrl : 'edit/templates/inuse.view.html',
					},
					'editStoriesShowEmail@editStories': {
						templateUrl : 'edit/templates/email.view.html',
					},
				}
			})

			.state('editMedia', {
				parent: 'edit',
				url: '/media/',
				deepStateRedirect: true,
				params: {obj: null},
				views: {
					'editMedia@edit': {
						controller  : 'EditMediaController as vm',
						templateUrl : 'edit/templates/media.view.html',
					},
					'editMediaButtons@editMedia': {
						templateUrl : 'edit/templates/buttons.view.html',
					},
					'editMediaInuseList@editMedia': {
						templateUrl : 'edit/templates/inuse.view.html',
					},
					'editMediaShowEmail@editMedia': {
						templateUrl : 'edit/templates/email.view.html',
					},
				}
			})

			.state('editFamily', {
				parent: 'edit',
				url: '/family',
				views: {
					'editFamily@edit': {
						controller  : 'EditFamilyController as vm',
						templateUrl : 'edit/templates/family.view.html',
					},
					'editFamilyButtons@editFamily': {
						templateUrl : 'edit/templates/buttons.view.html',
					},
					'editFamilyInuseList@editFamily': {
						templateUrl : 'edit/templates/inuse.view.html',
					},
					'editFamilyShowEmail@editFamily': {
						templateUrl : 'edit/templates/email.view.html',
					},
				}
			})
			
			.state("communication", {
				url: '/communication',
				controller  : 'CommunicationController',
				templateUrl : "communication/communication.view.html",
			});

			$locationProvider.html5Mode(true);
				
	$mdThemingProvider.definePalette('defaultPrimary', {
	      '50': '895036',
	     '100': '935A40',
	     '200': '9D644A',
	     '300': 'A76E54',
	     '400': 'BB8268',
	     '500': 'CF967C',
//	     '600': '753C22',
		 '600': 'AF9B60',        // http://www.computerhope.com/cgi-bin/htmlcolor.pl?c=AF9B60
	     '700': '6B3218',
	     '800': 'C62828',
	     '900': '571E04',
	    'A100': '4D1400',
	    'A200': '390000',
	    'A400': '2F0000',
	    'A700': '2F0000',
    	'contrastDefaultColor': 'light',    
    	'contrastDarkColors': ['50', '100', //hues which contrast should be 'dark' by default
     	'200', '300', '400', 'A100']
  	});
	
 	$mdThemingProvider.definePalette('defaultAccent', {
	      '50': '376E8A',
	     '100': '417894',
	     '200': '4B829E',
	     '300': 'A76E54',
	     '400': '558CA8',
	     '500': '73AAC6',
//	     '600': '2D6480',
		 '600': '6175B0',						// http://www.computerhope.com/cgi-bin/htmlcolor.pl?c=6175b0
	     '700': '235A76',
	     '800': '19506C',
	     '900': '053C58',
	    'A100': '00324E',
	    'A200': '002844',
	    'A400': '001E3A',
		'A700': '001430',
    	'contrastDefaultColor': 'dark',    
    	'contrastDarkColors': ['50', '100', //hues which contrast should be 'dark' by default
     	'200', '300', '400', 'A100']
  	});
  	
	$mdThemingProvider.theme('default').primaryPalette('defaultPrimary', {
		'default': '600', 
		'hue-1': '100', 
		'hue-2': '600', 
		'hue-3': 'A100' 
	});
      
	$mdThemingProvider.theme('default').accentPalette('defaultAccent', {
		'default': '600', 
		'hue-1': '100', 
		'hue-2': '600', 
		'hue-3': 'A100' 
	});
      
	$mdThemingProvider.theme("success-toast");
	$mdThemingProvider.theme("error-toast");
})
	
	.run(function($rootScope, $location, $cookieStore, $http) {       
			$rootScope.globals = $cookieStore.get('globals') || {};							// keep user logged in after page refresh
		if ($rootScope.globals.currentUser) {
			$http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata; // jshint ignore:line
		}

		$rootScope.$on('$locationChangeStart', function (event, next, current) {		// redirect to login page if not logged in and trying to access a restricted page           
 /* 			var restrictedPage = $.inArray($location.path(), ['/login', '/register', '/guest']) === -1;
			var loggedIn = $rootScope.globals.currentUser;
			if (restrictedPage && !loggedIn) {
				$location.path('/login');
			}
*/		});


});

// ******************************************************
// Main Controller for the app
// ******************************************************

app.controller("root", function ($timeout, $mdDialog, $state, $scope, $rootScope, SessionFactory, Gparams, UtilityFactory) {

	// initialization 	
	
	$(document).ready(function() {
		  $('.collapse.in').prev('.panel-heading').addClass('active');
		  $('#accordion, #bs-collapse')
		    .on('show.bs.collapse', function(a) {
		      $(a.target).prev('.panel-heading').addClass('active');
		    })
		    .on('hide.bs.collapse', function(a) {
		      $(a.target).prev('.panel-heading').removeClass('active');
		    });
		});
	var vm = this; 

		vm.do = {};
		vm.data = {};
		vm.do.hide = false;
		vm.mainDisabled = true;
		vm.showCalendar = false;
		vm.homeLink = Gparams.homeLink;
		vm.appName = Gparams.appName;
		vm.currentYear = Gparams.currentYear;
		vm.data.yearsDead = 10;

		$state.go('login');

// functions
		
		vm.doPrivacy = function() {
			vm.showPrivacy();
		};
		
		vm.doCalendar = function() {
			vm.showCalendar = false;
			Gparams.showCalendar = !Gparams.showCalendar;
		};
			
		vm.logout = function() {
			SessionFactory.logout();
		};

		vm.changeView = function (which) {
			$state.go(which);
			return false;
		} ; 

		$rootScope.$on('enable main buttons', function(event, args) {
			vm.mainDisabled = false;
			$scope.$evalAsync(function() {});									// triggers diget, better than safeApply
		});
		
		vm.showSettings = function() {
			vm.closeDialog();
	        $mdDialog.show({
		          clickOutsideToClose: true,
		          scope: $scope,
		          preserveScope: true,
		          templateUrl: 'menus/templates/settings.view.html',
		          openFrom: $('#toastLocation'),
		          closeTo: $('#toastLocation'),
		          controller: 'DlogController',
		          onComplete: afterShowAnimation,
		    });

	        function afterShowAnimation(scope, element, options) {
	           // post-show code here: DOM element focus, etc.
	        }
		};

		vm.showPolicy = function() {
			vm.closeDialog();
	        $mdDialog.show({
		          clickOutsideToClose: true,
		          scope: $scope,
		          preserveScope: true,
		          templateUrl: 'menus/templates/policy.view.html',
		          openFrom: $('#toastLocation'),
		          closeTo: $('#toastLocation'),
		          controller: 'DlogController',
		          onComplete: afterShowAnimation,
		    });

	        function afterShowAnimation(scope, element, options) {
	           // post-show code here: DOM element focus, etc.
	        }		
	    };
		
	    vm.showPrivacy = function($event) {
	        $mdDialog.show({
	          clickOutsideToClose: true,
	          scope: $scope,
	          preserveScope: true,
	          templateUrl: 'menus/templates/privacy.view.html',
	          openFrom: $('#toastLocation'),
	          closeTo: $('#toastLocation'),
	          controller: 'DlogController',
	          onComplete: afterShowAnimation,
	        });

	        function afterShowAnimation(scope, element, options) {
	           // post-show code here: DOM element focus, etc.
	        }
	    };
	
	    vm.closeDialog = function() {
	    	$mdDialog.hide();
	    };


});