angular
	.module('root')
		
	.factory('CommunicationFactory', function(DatabaseService, UtilityFactory, Gparams) {				
		var _theData = {};
		var _showFlag;
		
		var query = "id=" + Gparams.curUserID;
		DatabaseService.getRecipients(query)
			.then(function successCallback(response) {
				_theData = response.data.names;
				return response;
 		}, function errorCallback(response) {
				UtilityFactory.showAlertToast('<md-toast>Retrieval of recipients for ' + vm.fullName + ' failed with the error:' + response.data.error + '.' + vm.appName +' has been notified</md-toast>');
				UtilityFactory.sendBugReport(response);
				return response;
		});
	
		_saveRecipients = function() {
			DatabaseService.setRecipients(vm.params.curUserID, vm.globalList)
				.then(function successCallback(response) {
					if (response.status=='200') {
		  				return;
				    } else {
						UtilityFactory.showAlertToast('<md-toast>Saving of recipients for ' + vm.fullName + ' failed with the error:' + response.data.error + '.' + vm.appName +' has been notified</md-toast>');
						UtilityFactory.sendBugReport(response);
					}
				});
		};

// public functions
		
		setRecipients = function(theData) {
			_theData = theData;
			return;	
		}

		getRecipients = function() {
			return _theData;	
		}
			
		return {
			getRecipients	: getRecipients,
			setRecipients	: setRecipients,
		}

})