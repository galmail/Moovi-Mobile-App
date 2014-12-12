/**
 * Settings controller.
 *
 */

moovi.controllers.controller('SettingsCtrl', function($scope, User) {
	$scope.user = User.getInfo();
	//console.log('Inside Settings: ' + User.getInfo());
});
