/* ******************************************************

 Edit Name Controller

 ******************************************************
 */

(function () {
    'use strict';

    angular // jshint ignore:line
        .module('root')
        .controller('EditNameController', EditNameController)

        .config(function () {
        });

    EditNameController.$inject = ['$scope', '$rootScope', '$state', '$stateParams', '$mdDialog', 'EditService', 'AddService', 'AddFactory', 'SearchFactory', 'SheetService', '$filter', 'Gparams', 'UtilityFactory'];
    function EditNameController($scope, $rootScope, $state, $stateParams, $mdDialog, EditService, AddService, AddFactory, SearchFactory, SheetService, $filter, Gparams, UtilityFactory) {

// initialization code

        var vm = this;
        var nameDropzone;

        vm.data = {};
        vm.params = Gparams;
        vm.tab = 1;
        vm.tabs = ['editName', 'editEvents', 'editAttributes', 'editMarriages', 'editStories', 'editMedia', 'editFamily'];

        vm.doChange0 = doChange0;			//prototype function declaration so can be called before defined
        vm.init0 = init0;
        vm.onReset = onReset;
        vm.doAdd0 = doAdd0;
        vm.showDetails = showDetails;
        vm.showDetails0 = showDetails0;
        vm.searchPage0 = searchPage0;
        vm.onSubmit0 = onSubmit0;

        try {
            vm.tab = $stateParams.obj.tab;
            vm.who = $stateParams.obj.who;
            vm.what = $stateParams.obj.what;
            if (vm.what === 'main' && vm.params.curPersonID !== vm.who) {  // main person has changed so update it
                vm.params.curPersonID = vm.who;
                vm.data = UtilityFactory.setFamily(vm.params.curPersonID)
                    .then(function successCallback(response) {
                        if (response.status === 200) {
                            $state.go(vm.tabs[vm.tab]);
                        } else {
                            UtilityFactory.showAlertToast('<md-toast> An error occurred during the update of ' +
                                vm.fullName + ' the error was: ' + vm.response.theError + '. ' + vm.params.appName +
                                ' has been notified.</md-toast>');
                            $state.go(vm.tabs[vm.tab]);
                        }
                    });
            }
        } catch (err) {
            vm.tab = 0;
            $rootScope.rs.editSelectedTab = 0;
            $state.go(vm.tabs[0]);
        }

        init0();

        function init0() {
            vm.data = angular.copy(UtilityFactory.getFamily()); // jshint ignore:line

            nameDropzone = new Dropzone("div#uploadProfile0", { // jshint ignore:line
                url: "/edit/php/uploadProfile.php",
                method: "POST",
                paramName: "file",
                clickable: true,
                maxFilesize: 5,
                uploadMultiple: false,
                parallelUploads: 1,
                createImageThumbnails: false,
                renameFilename: function (name) {
                    return vm.data.mainID + '.' + name.substr(name.lastIndexOf('.') + 1);
                },
                autoProcessQueue: true,
                acceptedFiles: '.jpeg, .jpg, .gif, .png',
                previewTemplate: document.getElementById('preview-template').innerHTML
            });

            nameDropzone.on("success", function (files, response) {
                UtilityFactory.showTemplateToast('<md-toast>The profile photo for ' + vm.fullName + ' was successfully updated in ' + vm.params.appName + '.</md-toast>');
            });
        }

//functions

        function doChange0() {

        }

        function doAdd0() {
            vm.data = {};

        }

        function showDetails(who) {
            $state.go('sheet', {obj: {name: 'editName', tab: vm.tab, whoID: who}});
        }

        function showDetails0(who) {
            $state.go('sheet', {obj: {name: 'editName', tab: vm.tab, whoID: who}});
        }

        function searchPage0(who, what) {
            $state.go('search', {obj: {name: 'editName', surname: vm.data.surname, tab: vm.tab, what: what, who: who}});
        }

        function onReset() {
            vm.data = {};
            init0();
        }

        function onSubmit0() {
            EditService.UpdateName(vm.data)
                .then(function successCallback(response) {
                    if (response.status === 200) {
                        UtilityFactory.showTemplateToast('<md-toast>' + vm.fullName + ' was successfully updated in ' +
                            vm.params.appName + '.</md-toast>');
                    } else {
                        UtilityFactory.showAlertToast('<md-toast> An error occurred during the update of ' +
                            vm.fullName + ' the error was: ' + vm.response.theError + '. ' + vm.params.appName +
                            ' has been notified.</md-toast>');
                    }
                });
        }

    }
})();
