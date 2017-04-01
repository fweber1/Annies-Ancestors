   angular
        .module('root')
		
		.controller('GedcomController', function($scope) {
             $scope.onSelectFile = function ($files) {
                  for (var i = 0; i < $files.length; i++) {
                      var $file = $files[i];
                      $upload.upload({
                          url: 'api/HomeControler/upload',
                          file: $file,
                          progress: function (e) {
                              // wait...
                          }
                      })
                        .then(function (data, status, headers, config) {
                            alert('file is uploaded successfully');
                        });
                  }
              }
          });