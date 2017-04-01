// ******************************************************
//
// Controller for family sheets
//
// ******************************************************

(function () {				'use strict';
angular
.module('root')
.controller('SheetController', SheetController);

	SheetController.$inject = [  'SheetFactory', 'UtilityFactory', 'SearchFactory', '$mdDialog', '$filter', '$stateParams', '$rootScope', '$scope', 'SheetSliderService', '$state', 'Gparams'];
	 	function SheetController( SheetFactory,   UtilityFactory,   SearchFactory,   $mdDialog,   $filter,   $stateParams,   $rootScope,   $scope,   SheetSliderService,   $state,   Gparams) {

	 	var vm = this;
	 	var dlogPromise;
	 	var savedID;

	 	vm.showAdd = false;
	 	vm.params = Gparams;
	 	vm.data = {};
	 	$rootScope.data = {};
	 	vm.ids = {};

		try {
			vm.fromPage = $stateParams.obj.name;
			vm.tab = $stateParams.obj.tab;
			vm.whoID = $stateParams.obj.whoID;
			if(vm.whoID != vm.params.curPersonID){
				vm.data = UtilityFactory.getFamily();
				savedID = vm.data.mainID;
				UtilityFactory.setFamily(vm.whoID)
					.then(function successCallback(response) {
						init();
		  			}, function errorCallback(response) {
		 				$q.reject(response)	;			// See: http://davidcai.github.io/blog/posts/angular-promise/
						return angular.toJson(response);
					});
			} else {
				vm.data = UtilityFactory.getFamily();
				init();
			}
		} catch(err) {
			vm.fromPage = '';
			vm.tab = -1;
			vm.whoID = vm.params.curPersonID;
			init();
		}
		
		if(angular.isUndefined(vm.fromPage) || vm.fromPage==='') {
			vm.showReturn = false;
		} else {
			vm.showReturn = true;
		}

	 	function init() {
			vm.data = UtilityFactory.getFamily();
			vm.leftPerson = vm.data;
			vm.rightPerson = vm.data.spouses[vm.data.curSpouse];
			vm.middlePerson = vm.data.children;
			SheetSliderService.initSlider(vm.leftPerson);
			vm.sliderMax = SheetSliderService.getSliderMax();
			vm.sliderMin = SheetSliderService.getSliderMin();
			vm.slider = SheetSliderService.getSlider();	

/*					var sliderContainer = angular.element(document).find('md-slider');
					var e = new MouseEvent("click", {
						  view: window,
						  bubbles: true,
						  cancelable: true
						});
					sliderContainer[0].dispatchEvent(e);
*/					
			vm.ids.person1 = vm.leftPerson.mainID;
			vm.ids.father1 = vm.leftPerson.fathers[vm.leftPerson.curFather].mainID;
			vm.ids.mother1 = vm.leftPerson.mothers[vm.leftPerson.curMother].mainID;
			vm.ids.person2 = vm.rightPerson.mainID;
			try {			// WARNING: still need to get actual index of father and mother
				vm.ids.father2 = vm.rightPerson.fathers[0].mainID;
				vm.ids.mother2 = vm.rightPerson.mothers[0].mainID;
			} catch (err){
				vm.ids.father2 = -1;
				vm.ids.mother2 = -1;
			}
	 	}

		$rootScope.data.setStoryDiv = function(ndx) {
			vm.data.open1 = false;
			vm.data.open2 = false;
			vm.data.open3 = false;
			vm.data.theTitle = vm.stories[ndx].theTitle;
			vm.data.theContent = vm.stories[ndx].theContent;
			$scope.$evalAsync();
	 	};
	 	
		$rootScope.data.setVideoDiv = function(ndx) {
			vm.data.open0 = false;
			vm.data.open2 = false;
			vm.data.open3 = false;
			vm.data.theTitle = vm.videos[ndx].theTitle;
			// fix chrome bug: see http://codepen.io/cagegong/pen/bJHAz
			$('#videoTag').html('<video id="video" src=' + vm.videos[ndx].theFile + ' style="width:300px;height:240px" controls></video>');			  
			$scope.$evalAsync();
	 	};
	 	
		$rootScope.data.setAudioDiv = function(ndx) {
			vm.data.open0 = false;
			vm.data.open1 = false;
			vm.data.open3 = false;
			vm.data.theTitle = vm.audios[ndx].theTitle;
			// fix chrome bug: see http://codepen.io/cagegong/pen/bJHAz
			$('#audioTag').html('<audio id="audio" controls><source src=media/' + vm.leftPerson.mainID + '/' + vm.audios[ndx].theFile + ' type="audio/mp3"></audio>');
			$scope.$evalAsync();
	 	};

		$rootScope.data.setImgDiv = function(ndx) {
			vm.data.open0 = false;
			vm.data.open1 = false;
			vm.data.open2 = false;
			vm.data.theTitle = vm.images[ndx].theTitle;
			vm.data.theFile = vm.images[ndx].theFile;
			$scope.$evalAsync();
	 	};

		$scope.closeAllMedia = function() {
			vm.data.open0 = false;
			vm.data.open1 = false;
			vm.data.open2 = false;
			vm.data.open3 = false;
		};
		
	 	$scope.$on("$destroy", function() {
/*			$('#video').src = '';
		    $('#videoTag').html('')	;
			$('#audio')[0].src = '';
		    $('#audioTag').html('')	;
*/		});
	 	
		$scope.updateSlider = function() {
			SheetSliderService.setSlider(vm.slider);
			SheetFactory.setRightPerson();
			vm.rightPerson = SheetFactory.getRightPerson();	 
			try {														// WARNING: still need to get actual index of father and mother
				vm.ids.father2 = vm.rightPerson.fathers[0].mainID;
				vm.ids.mother2 = vm.rightPerson.mothers[0].mainID;
			} catch (err){
				vm.ids.father2 = -1;
				vm.ids.mother2 = -1;
			}
			SheetFactory.setMiddlePerson();
			vm.middlePerson = SheetFactory.getMiddlePerson();
		};
		
 		$scope.disableSpouse = function(who) {
			return SheetFactory.disableLeftSpouse(who);
		};
		
		$scope.updateSpouse = function(who) {
			var tmp = new Date(vm.leftPerson.spouses[who].startDate);
			vm.slider = tmp.valueOf() + 100;	
			SheetSliderService.setSlider(vm.slider);
			SheetFactory.setRightPerson();
			vm.rightPerson = SheetFactory.getRightPerson();	 
		};
		
		vm.returnToStart = function() {
			if(vm.whoID!=vm.params.curPersonID) {
				UtilityFactory.setFamily(savedID)
				.then(function successCallback(response) {
					$state.go(vm.fromPage, {obj:{tab:vm.tab}});
	  			}, function errorCallback(response) {
	 				$q.reject(response)	;			// See: http://davidcai.github.io/blog/posts/angular-promise/
	 				$state.go(vm.fromPage, {obj:{tab:vm.tab}});
	 				return angular.toJson(response);
				});
			} else {
				$state.go(vm.fromPage, {obj:{tab:vm.tab}});
			}
		};	
 		
 		$scope.hideDiv = function(event) {
 	        document.getElementById("floatdiv").style.visibility='hidden';
 		};
 		
 		$scope.moveDivs = function(event) {
 	        x=event.screenX;
 	        y=event.screenY;
 	        
 	        document.getElementById("floatdiv").style.left=x+"px";
 	        document.getElementById("floatdiv").style.top=y+"px";
 	        document.getElementById("floatdiv").style.visibility='visible';
 	    };

		vm.showDetails = function(theID) {
 			vm.marriages = [];
 			vm.showMarriages = false;
 			
			event.stopPropagation();
 			vm.data = findPerson(theID);
			vm.closeDialog();
			SheetService.getAttributes(theID)	
			.then(function successCallback(response) {
				if (response.status=="200") {
					vm.data.events = response.data;

		 			vm.showMarriages = $filter('filter')(vm.data.events, {mainType:'FAMI'}, true);
		 			vm.marriages = $filter('filter')(vm.data.events, {theType:'MARR'}, true);
		 			vm.engages = $filter('filter')(vm.data.events, {theType:'ENGA'}, true);
		 			vm.announces = $filter('filter')(vm.data.events, {theType:'MARB'}, true);
		 			vm.licenses = $filter('filter')(vm.data.events, {theType:'MARL'}, true);
		 			vm.contracts= $filter('filter')(vm.data.events, {theType:'MARC'}, true);
		 			vm.dowries= $filter('filter')(vm.data.events, {theType:'MARS'}, true);
		 			vm.commons= $filter('filter')(vm.data.events, {theType:'COMM'}, true);
		 			vm.census1= $filter('filter')(vm.data.events, {theType:'CENS'}, true);
		 			vm.divorces= $filter('filter')(vm.data.events, {theType:'DIV'}, true);
		 			vm.filed= $filter('filter')(vm.data.events, {theType:'DIVF'}, true);
		 			vm.other1 = $filter('filter')(vm.data.events, {theType:'EVEN'}, true);

		 			vm.showEvents = $filter('filter')(vm.data.events, {mainType:'EVEN'}, true);
		 			vm.adoptions = $filter('filter')(vm.data.events, {theType:'ADOP'}, true);
		 			vm.births = $filter('filter')(vm.data.events, {theType:'BIR'}, true);
		 			vm.deaths = $filter('filter')(vm.data.events, {theType:'DEA'}, true);
		 			vm.christenings = $filter('filter')(vm.data.events, {theType:'CHR'}, true);
		 			vm.burials= $filter('filter')(vm.data.events, {theType:'BURI'}, true);
		 			vm.cremations = $filter('filter')(vm.data.events, {theType:'CREM'}, true);
		 			vm.baptism = $filter('filter')(vm.data.events, {theType:'BAPM'}, true);
		 			vm.barMitvah = $filter('filter')(vm.data.events, {theType:'BARM'}, true);
		 			vm.bahMitzvah = $filter('filter')(vm.data.events, {theType:'BASM'}, true);
		 			vm.blessing = $filter('filter')(vm.data.events, {theType:'BLES'}, true);
		 			vm.adultChristening = $filter('filter')(vm.data.events, {theType:'CHRA'}, true);
		 			vm.confirmations = $filter('filter')(vm.data.events, {theType:'CONF'}, true);
		 			vm.firstCommunions = $filter('filter')(vm.data.events, {theType:'FCOM'}, true);
		 			vm.ordinations = $filter('filter')(vm.data.events, {theType:'ORDN'}, true);
		 			vm.naturalizations = $filter('filter')(vm.data.events, {theType:'NATU'}, true);
		 			vm.christening = $filter('filter')(vm.data.events, {theType:'EMIG'}, true);
		 			vm.emigration = $filter('filter')(vm.data.events, {theType:'IMMI'}, true);
		 			vm.census2 = $filter('filter')(vm.data.events, {theType:'CENS'}, true);
		 			vm.probates = $filter('filter')(vm.data.events, {theType:'PROB'}, true);
		 			vm.wills = $filter('filter')(vm.data.events, {theType:'WILL'}, true);
		 			vm.graduation = $filter('filter')(vm.data.events, {theType:'GRAD'}, true);
		 			vm.other2 = $filter('filter')(vm.data.events, {theType:'EVEN'}, true);

		 			vm.showAttributes = $filter('filter')(vm.data.events, {mainType:'ATTR'}, true);
		 			vm.names = $filter('filter')(vm.data.events, {theType:'NAM'}, true);
		 			vm.descriptions = $filter('filter')(vm.data.events, {theType:'DSCR'}, true);
		 			vm.scholastics = $filter('filter')(vm.data.events, {theType:'EDUC'}, true);
		 			vm.tribals = $filter('filter')(vm.data.events, {theType:'NATI'}, true);
		 			vm.occupations = $filter('filter')(vm.data.events, {theType:'OCCO'}, true);
		 			vm.religious = $filter('filter')(vm.data.events, {theType:'RELI'}, true);
		 			vm.possessions = $filter('filter')(vm.data.events, {theType:'PROP'}, true);
		 			vm.residences = $filter('filter')(vm.data.events, {theType:'RESI'}, true);
		 			vm.titles = $filter('filter')(vm.data.events, {theType:'TITL'}, true);
		 			vm.castes = $filter('filter')(vm.data.events, {theType:'CAST'}, true);
		 			vm.other3 = $filter('filter')(vm.data.events, {theType:'FACT'}, true);
		 			
		 			vm.showMedia = $filter('filter')(vm.data.events, {mainType:'media'}, true);
		 			vm.stories = $filter('filter')(vm.data.events, {theType:'story'}, true);
		 			vm.videos = $filter('filter')(vm.data.events, {theType:'video'}, true);
		 			vm.audios = $filter('filter')(vm.data.events, {theType:'audio'}, true);
		 			vm.images = $filter('filter')(vm.data.events, {theType:'image'}, true);
				} else {
					UtilityFactory.showAlertToast('<md-toast>The retrieval of details for the current person failed with error message: ' + response.data.error + '. ' + vm.Gparams.appName + ' has been notified.</md-toast>');		
					UtilityService.sendBugReport(response);
				}
			
				dlogPromise = $mdDialog.show({
			          clickOutsideToClose: true,
			          scope: $scope,
			          preserveScope: true,
			          templateUrl: 'sheet/templates/detail.view.html',
			          openFrom: $('#toastLocation'),
			          closeTo: $('#toastLocation'),
			          controller: 'DlogController',
			          onComplete: afterShowAnimation,
				
				});
			});
		};
			
        function findPerson(theID) {
        	var tmp;
 			if(vm.leftPerson.mainID==theID) return vm.leftPerson;
 			tmp = $filter('filter')(vm.leftPerson.spouses, {mainID:theID}, true);
 			if(tmp.length>0) return tmp[0];
 			tmp = $filter('filter')(vm.leftPerson.fathers, {mainID:theID}, true);
 			if(tmp.length>0) return tmp[0];
 			tmp = $filter('filter')(vm.leftPerson.mothers, {mainID:theID}, true);
 			if(tmp.length>0) return tmp[0];
 			tmp = $filter('filter')(vm.leftPerson.children, {mainID:theID}, true);
 			if(tmp.length>0) return tmp[0];
 			tmp = $filter('filter')(vm.rightPerson.fathers, {mainID:theID}, true);
 			if(tmp.length>0) return tmp[0];
 			tmp = $filter('filter')(vm.rightPerson.mothers, {mainID:theID}, true);
 			if(tmp.length>0) return tmp[0];
        }
        
        function afterShowAnimation(scope, element, options) {
           // post-show code here: DOM element focus, etc.
        }		
    
	
	    vm.closeDialog = function() {
	    	$mdDialog.cancel(dlogPromise);
	    };
	 }

})();