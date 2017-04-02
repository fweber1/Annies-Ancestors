// ******************************************************
//
// Person Controller
//
// ******************************************************

'use strict'; // jshint ignore:line

angular.module('root').controller('EditController', EditController); // jshint ignore:line

EditController.$inject = ['$scope', '$rootScope', '$state', '$stateParams', 'UtilityFactory', 'Gparams'];
function EditController(   $scope,   $rootScope,   $state,   $stateParams,   UtilityFactory,   Gparams) {

    var vm = this;

    vm.params = Gparams;
    vm.data = angular.copy(UtilityFactory.getFamily()); // jshint ignore:line

    $scope.cntrl = {};
    $scope.email = {};
    $scope.email.data = {};
    $scope.email.showEmail = false;
    $scope.email.ownerID = vm.params.curUserID;
    $scope.email.mainID = vm.params.curPersonID;

    if (vm.params.debug) {
        $scope.email.ownerName = "John Q. Public";
        $scope.email.ownerID = 1;
        $scope.email.nEditors = 3;
        $scope.email.editors = [{mainID: 6121, fullName: 'Hazel Johnson'}, {
            mainID: 6122,
            fullName: 'Sarah Johnson'
        }, {mainID: 6123, fullName: 'Angela Johnson'}];																// NOTE: need to make this live
    } else {
        $scope.email.ownerID = 1;

// TODO make it real for production

    }

    $scope.email.inuse = ($scope.email.ownerID !== $scope.email.mainID || $scope.email.nEditors > 0);

    if ($scope.email.which === 0) {
        $scope.email.data.body = vm.params.curUserName + ' has updated information about ' + vm.data.fullName;
        $scope.email.data.subject = 'Change Made to ' + vm.data.fullName;
    } else {
        $scope.email.data.body = vm.params.curUserName + ' has updated information about ' + vm.data.fullName;
        $scope.email.data.subject = 'Change Made to ' + vm.data.fullName;
    }

    vm.tab = 0;
    vm.disabledTabs = !vm.params.debug;

    vm.titles = ['Name', 'Events', 'Attributes', 'Marriages', 'Stories', 'Media', 'Family'];
    $scope.cntrl.title = vm.titles[vm.tab];

    vm.tabs = ['editName', 'editEvents', 'editAttributes', 'editMarriages', 'editStories', 'editMedia', 'editFamily'];

    $scope.$watch('rs.editSelectedTab', function (current) {
        try {
            vm.tab = $stateParams.obj.tab;
            $rootScope.rs.editSelectedTab = current;
            vm.data.title = vm.titles[current];
            $state.go(vm.tabs[current]);
        } catch (err) {
            $state.go(vm.tabs[$rootScope.rs.editSelectedTab]);
        }
    });

    $scope.cntrl.setTitle = function () {
        vm.data.title = vm.titles[vm.tab];
    };

    $scope.email.submitEmail = function () {
        $scope.email.showEmail = false;
    };

    $scope.email.resetEmail = function (data) {
        data.subject = '';
        data.body = '';
        $scope.email.showEmail = true;
    };
}
