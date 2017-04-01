// ******************************************************
//
// Controller for scrapbook albums
//
// ******************************************************

(function () {    'use strict';
    angular
        .module('root')
        .controller('AlbumController', AlbumController)   
    	.config(function() { });

    AlbumController.$inject = ['$scope', '$filter', 'DatabaseService', 'SessionService', 'Gparams'];		
   	function AlbumController(  $scope,   $filter,   DatabaseService,    SessionService,   Gparams) {
		var vm = this;
		
   		$scope.$on('$viewContentLoaded', function() {loadFlipbook()}); 

	   	$scope.params = Gparams;																	
	   	SessionService.getPerson($scope.params.curPersonID)
			.then(function successCallback(response) {
 				if (response.status=="200") {
	                vm.person = response.data;
	                vm.person.fullName = vm.person.namePrefix + ' ' + vm.person.givenName + ' ' + vm.person.middleName + ' ' + vm.person.surname + ' ' + vm.person.nameSuffix;

	  			} else {
	  				UtilityFactory.showAlertToast('<md-toast>The requested album cannot be retreived. The error was ' +response.error + ' and ' + vm.params.appName + ' has been notified.</md-toast>');
					UtilityService.sendBugReport(vm.response);

	 			}
			});



		$(document).keydown(function(e) {
		    var key = e.which;
			if (key == '37') {
				e.preventDefault();
				$('.flipbook').turn('previous');
				return false;
		    } else if (key == '39') {
				e.preventDefault();
		    	$('.flipbook').turn('next');
		    	return false;
		    }
		});
 		$scope.$on('$destroy', function() {angular.element(document).unbind('keydown');});

}
    function isChrome() {
			return navigator.userAgent.indexOf('Chrome')!=-1;	
		}

		function updateDepth(book, newPage) {		
			var page = book.turn('page'),
				pages = book.turn('pages'),
				depthWidth = 16*Math.min(1, page*2/pages);
		
			newPage = newPage || page;
		
			if (newPage>3)
				$('.flipbook .p2 .depth').css({
					width: depthWidth,
					left: 20 - depthWidth
				});
			else $('.flipbook .p2 .depth').css({width: 0});		
			
			depthWidth = 16*Math.min(1, (pages-page)*2/pages);
		
			if (newPage<pages-3)
				$('.flipbook .backFlyleaf .depth').css({
					width: depthWidth,
					right: 20 - depthWidth
				});
			else $('.flipbook .backFlyleaf .depth').css({width: 0});		
		}

// These function not needed since demo pages are self contained in album.view.html
/*		$scope.loadPage = function(page, pageElement) {	
			$.ajax({url: '/album/content/pages/page' + page + '.html'}).
				done(function(pageHtml) {
					pageElement.html(pageHtml);
				});
		}


		$scope.addPage = function(page, book) {
		
			var id, pages = book.turn('pages');
		
			var pageElement = $('<div />',
				{'class': 'own-size',
					css: {width: 460, height: 582}
				}).
				html('<div class="loader"></div>');
		
			if (book.turn('addPage', pageElement, page)) {
				loadPage(page, pageElement);
			}
		
		}
*/

		function loadFlipbook() {	
			flipbook = $('#flipbook');
			flipbook.turn({
				elevation: 50,
				acceleration: !isChrome(),
				autoCenter: true,
				duration: 1500,
				pages: 18,
				page:1,
				width:960,
				height:600,
				when: {		
					turning: function(e, page, view) {	
						var book = $(this),
							currentPage = book.turn('page'),
							pages = book.turn('pages');
			
						if (currentPage>3 && currentPage<pages-3) {						
							if (page==1) {
								book.turn('page', 2).turn('stop').turn('page', page);
								e.preventDefault();
								return;
							} else if (page==pages) {
								book.turn('page', pages-1).turn('stop').turn('page', page);
								e.preventDefault();
								return;
							}			
						} else if (page>3 && page<pages-3) {			
							if (currentPage==1) {
								book.turn('page', 2).turn('stop').turn('page', page);
								e.preventDefault();
								return;
							} else if (currentPage==pages) {
								book.turn('page', pages-1).turn('stop').turn('page', page);
								e.preventDefault();
								return;
							}			
						}
			
						updateDepth(book, page);
						
						if (page>=2) $('.flipbook .p2').addClass('fixed');
						else $('.flipbook .p2').removeClass('fixed');
			
						if (page<book.turn('pages')) $('.flipbook .backFlyleaf').addClass('fixed');
						else $('.flipbook .backFlyleaf').removeClass('fixed');
			
			
					},
		
					turned: function(e, page, view) {
						var book = $(this),
							pages = book.turn('pages');
							updateDepth(book);
			
						if (page==2 || page==3) book.turn('peel', 'br');
						book.turn('center');
					},
		
					end: function(e, pageObj) {
						var book = $(this);
						updateDepth(book);
					},
			
// Not needed until pages not defined in album.view.html			
/*					missing: function (e, pages) {			
						for (var i = 0; i < pages.length; i++) addPage(pages[i], $(this));
					}
*/				}
				
			});
		}
		
//		$scope.$on('$destroy', function () {flipbook = null};
			

})
();
