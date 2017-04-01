// updated 1/12/17, passed testing

(function () {
    'use strict';

    angular
        .module('root')
        .controller('HomeController', HomeController);

    HomeController.$inject = [ 'Gparams'];
    function HomeController(    Gparams) {
        var vm = this;
   		vm.params = Gparams;

   	}
})();