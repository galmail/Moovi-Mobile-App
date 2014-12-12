/**
 * Video directive
 *
 */

moovi.directives.directive('gvVideo', function() {
	return {
		restrict: 'E',
		transclude: true,
		scope: {
			url: '=url'
		},
		templateUrl: function(elm, attrs) {
      return '/js/templates/_videoTag.html';
    },
		link:	function(scope) {
			scope.mp4url = scope.url + '.mp4';
			scope.webmurl = scope.url + '.webm';
			scope.ogvurl = scope.url + '.ogv';
			
			// scope.debug = function(exp) {
			// 	return angular.toJson(exp, true);
			// }

		}
	}
});