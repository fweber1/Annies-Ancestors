// updated 1/12/17, passed testing

(function () {
'use strict';

 angular
.module('root')

.factory('UtilityFactory', function($mdToast, $filter, UtilityService, Gparams) {

	var _family;

	return {

/* public functions */

		getTodayInHistory: function() {
/*	 	DatabaseService.getHistoryFact()
			.then(function successCallback(response) {
				var blurb;
				var content;
				var whichOne;
				var tmp;
				try {
					if (response.status==200) {
						blurb = $('#infoDetail').html(response.data.parse.text["*"]);
						blurb.find('a').each(function() { $(this).replaceWith($(this).html()); });		// remove links as they will not work
						blurb.find('sup').remove();														// remove any references
						blurb.find('.mw-ext-cite-error').remove();										// remove cite error
						content = $('#infoDetail').html().split("<ul>");
						content.unshift();
						$('#infoDetail').html(content);
						content = $('#infoDetail').html().split("<li>");
						whichOne = Math.floor((Math.random() * content.length) + 1);
						tmp = content[whichOne].replace("</li>","");
						$('#article1').html("On this date in "+tmp);
						$('#infoDetail').html(" ");
					} else {
						$('#article1').html("<p>An error occured while retrieving 'Today In History' from Wikipedia.</p>");
					}
				} catch(err) {
					$('#article1').html('</p>The Wikipedia "today in history" is unavailable.</p>')
				}
		});
/*	},

	getNameHistory: function(theName) {
/*		DatabaseService.getNameFact(theName)
			.then(function successCallback(response) {
				var blurb;
				var content;
				var def;
				var tmp;
				try {
					if (response.status==200) {
						blurb = $('#nameDetail').html(response.data.parse.text["*"]);
						blurb.find('div').remove();
						blurb.find('h2').remove();
						blurb.find('table').remove();
						blurb.find('a').each(function() { $(this).replaceWith($(this).html()); });		// remove links as they will not work
						ontent = $('#nameDetail').html().split("<ul>");
						content.unshift();
						$('#nameDetail').html(content);
						content = $('#nameDetail').html().split("<li>");

						def = $('#nameDetail p').detach().text();
						tmp = def.split(".");
						tmp.pop();
						$('#article2').append(tmp);

						tmp = $('#nameDetail').text();
						tmp = tmp.replace(/(\r\n|\r|\n){2,}/g, '$1<br />');									// replace multiple \n
						tmp = tmp.replace(/(\r\n|\r|\n)/g, '$1<br />');									// replace multiple \n
						tmp = 'The following notable people are named Johnson:' + tmp;
						$('#myDialogContent').html(tmp);
					} else {
						$('#infoDetail').html("<p>An error occured while retrieving the 'Name History' from Wikipedia.</p>");
					}
				} catch(err) {
					$('#infoDetail').html('</p>The Wikipedia "name history" is unavailable.</p>')
				}
		});
*/	},

	setFamily: function(id) {
		return UtilityService.getFamily(parseInt(id))
		.then(function successCallback(response) {
			_family = response;
			return response;
		});
	},

	getFamily: function() {
    	return _family;
    },

	showTemplateToast: function(template) {
		$mdToast.show({
		template	: template,
		position	: 'top right',
		hideDelay	: 3000,
		parent		: $('#toastLocation')
		});
	},

    showAlertToast: function(template) {
		$mdToast.show({
			template	: template,
			position	: 'top left',
			hideDelay	: 3000,
			toastClass	: 'md-error-toast-theme',
			parent		: $('#toastLocation')
		});
 	},

 	formatDates: function(theDate) {
		var exports;
		var tmp;
		if(theDate != '0000-00-00') {
			tmp = $filter('date')(theDate, 'MMMM dd, yyyy');
		} else {
			tmp = '';
		}
		exports.theDate = tmp;
		return exports.theDate;
	},

	getLength: function(obj) {
		var exports = 0;
		var o;

		for (o in obj) {exports++;}
		return exports;
	},

	getBirthInfo: function () {
		city = 'Paris';															// get lat and lng of 'city'
		var geocoder =new google.maps.Geocoder();
		geocoder.geocode( { 'address': city}, function(results, status) {
			if (status == google.maps.GeocoderStatus.OK) {
				alert("location : " + results[0].geometry.location.lat() + " " +results[0].geometry.location.lng());
			} else {
						alert("Something went wrong " + status);
					}
		});
	},


	between: function(a,b,val) {
		if(val>=a && val<=b ) return true;
		return false;
	}

};


// Private Functions


/* possible future features:
	https://en.wikipedia.org/wiki/Category:People_from_Muskegon,_Michigan
	weather
	lat/long
	map
*/
});
})();