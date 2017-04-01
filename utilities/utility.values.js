// updated 1/12/17, still in testing

(function () {
'use strict';

angular
.module('root')
.value('Gparams', {		
	currentDate		: (new Date()),
	guestID			: 6120,
    guestName   	: "Sir James Wilson Johnson III",
    curPersonName   : "Sir James Wilson Johnson III",
	curPersonID		: 6120,
	defaultID		: 6120,
	curUserID		: 6120,
	curUserName 	: 'Fred Weber',
	debug			: true,
	currentYear		: (new Date()).getFullYear(),
	appName			: "Annie's Ancestors",
	mainDisabled	: true,
	homeLink		: false,
	showCalendar	: false,
	canSave			: true
});

})();	