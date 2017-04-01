(function () {
    'use strict';

    angular
        .module('root')
        .factory('RandomStringService', RandomStringService);

    RandomStringService.$inject = [];
    function RandomStringService() {
		var service = {};
		service.randomString = randomString;
			
		return service;
		
		function randomString(length) {
			var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
			length = length || 10;
			var string = '', rnd;
			while (length > 0) {
				rnd = Math.floor(Math.random() * chars.length);
				string += chars.charAt(rnd);
				length--;
			}
			return string;
		};
	}
})();