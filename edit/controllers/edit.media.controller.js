/* ******************************************************

 Add Name Controller

 ToDo: add more sub=sheet off top of sheet
 ToDo: add note sub=sheet off top of sheet
 ToDo: move duplicate sheet to top of card to prevent collision with footer

 ******************************************************
 */

(function () {
    'use strict';

    angular // jshint ignore:line
        .module('root')
        .controller('EditMediaController', EditMediaController)

        .config(function () {
        });

    EditMediaController.$inject = ['$scope', '$state', '$mdDialog', 'EditService', '$filter', 'Gparams', 'UtilityFactory'];
    function EditMediaController($scope, $state, $mdDialog, EditService, $filter, Gparams, UtilityFactory) {

        var vm = this;

        vm.data = {};
        vm.params = Gparams;
        vm.setFocus = true;
        vm.tab = 5;
        vm.showVideos = false;
        vm.showAudios = false;
        vm.showImages = false;
        vm.showMsg = false;

        var titles = [];

        vm.data = {};
        vm.data.ownerID = 0;

        vm.doChange5 = doChange5;				//prototype function declaration so can be called before defined
        vm.doDelete5 = doDelete5;
        vm.doAdd5 = doAdd5;
        vm.init5 = init5;
        vm.onReset = onReset;
        vm.showDetails5 = showDetails5;
        vm.searchPage5 = searchPage5;
        vm.onSubmit5 = onSubmit5;

        init5();

        function init5() {
            vm.data.theFile = '';
            vm.data = angular.copy(UtilityFactory.getFamily()); // jshint ignore:line
            vm.data.theType = 'text';

            vm.data.ownerID = vm.params.curUserID;
            vm.data.videos = $filter('filter')(vm.data.media, {theType: 'video'}, true);
            vm.data.audios = $filter('filter')(vm.data.media, {theType: 'audio'}, true);
            vm.data.images = $filter('filter')(vm.data.media, {theType: 'image'}, true);

            vm.data.video = vm.data.videos[0];
            vm.data.audio = vm.data.audios[0];
            vm.data.image = vm.data.images[0];
            vm.data.showType = true;
            if (vm.data.video) {
                vm.data.selected = vm.data.video.id;
                vm.data.details = vm.data.video;
                vm.data.showVideos = true;
            } else if (vm.data.audio) {
                vm.data.selected = vm.data.audio.id;
                vm.data.details = vm.data.audio;
                vm.data.showAudios = true;
            } else if (vm.data.image) {
                vm.data.selected = vm.data.image.id;
                vm.data.details = vm.data.image;
                vm.data.showImages = true;
            } else {
                vm.showMsg = true;
            }
            vm.data.ownerID = vm.params.curUserID;
            vm.data.mainID = vm.params.curPersonID;

            if (vm.params.debug) {
                vm.data.ownerName = "John Q. Public";
                vm.data.ownerID = 1;
                vm.data.nEditors = 3;
                vm.data.editors = [{mainID: 6121, fullName: 'Hazel Johnson'}, {
                    mainID: 6122,
                    fullName: 'Sarah Johnson'
                }, {mainID: 6123, fullName: 'Angela Johnson'}];																// NOTE: need to make this live
            } else {
                vm.data.ownerID = 1;
// ToDO: make it real for production
            }

            vm.data.inuse = (vm.data.ownerID !== vm.data.mainID || vm.data.nEditors > 0);
            if (vm.data.which === 0) {
                vm.data.body = vm.params.curUserName + ' has updated information about ' + vm.data.fullName;
                vm.data.subject = 'Change Made to ' + vm.data.fullName;
            } else {
                vm.data.body = vm.params.curUserName + ' has updated information about ' + vm.data.fullName;
                vm.data.subject = 'Change Made to ' + vm.data.fullName;
            }
        }

        function doChange5() {

        }

        function doDelete5() {
            $scope.showConfirm();
            /*				editService.deleteEvents(vm.data.details.id)
             .then(function successCallback(response) {
             if (response.status=='200') {
             vm.onReset4();
             return;
             } else {
             }
             });
             */
        }

        function doAdd5() {
            vm.data.details = {};
            vm.data.showType = false;

        }

        function onReset() {
            vm.data = {};
            vm.init5();
        }

        function showDetails5(who) {
            $state.go('sheet', {obj: {name: 'editMedia', tab: vm.tab, whoID: who}});
        }

        function searchPage5(who, what) {
            $state.go('search', {obj: {name: 'editMedia', search: vm.data.surname, tab: vm.tab, what: what, who: who}});
        }

// ToDo: add mediaDropFile definition and uncomment later line

        function onSubmit5() {
            vm.data.showType = true;
//	 			mediaDropFile.processQueue();
        }

        $scope.showConfirm = function () {
            var confirm = $mdDialog.confirm()
                .title('Are You Sure You Want to Delete the media named ' + vm.data.details.theTitle + '?')
                .textContent('The media will be permanently deleted and this can not be undone.')
                .ariaLabel('Delete Item')
                .ok('OK')
                .cancel('Cancel');

            $mdDialog.show(confirm).then(function () {
                UtilityFactory.showTemplateToast('<md-toast>The media named ' + vm.data.details.theTitle +
                    ' about ' + vm.data.fullName + ' has been deleted.</md-toast>');
            }, function () {
                UtilityFactory.showTemplateToast('<md-toast>The deletion has been canceled.</md-toast>');
            });
        };
    }
})();
