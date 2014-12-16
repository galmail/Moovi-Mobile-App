/**
 * Auth controller.
 *
 */

moovi.controllers.controller('AuthCtrl', function($scope, Facebook, User) {

    /******** Facebook Internal Part ********/

    var fbLoadUserInfo = function() {
      Facebook.api('/me', function(data) {
        User.setInfo(User.fbParseUserInfo(data));
        User.connect(function(){
          console.log('connected!!');
        });
      });
    };

    ///////// Exposed Part /////////
    
    $scope.fbLogin = function() {
      if(!$scope.userIsConnected) {
        console.log('Trying to log in to facebook');
        Facebook.login(function(response) {
          if (response.status == 'connected') {
            $scope.logged = true;
            fbLoadUserInfo();
          }
        },{scope: 'email, user_birthday, user_friends'});
      } else {
        console.log('Already logged in to facebook');
        $scope.logged = true;
        fbLoadUserInfo();
      }
    };

    $scope.fbLogout = function(){
      Facebook.logout(function(){
        $scope.$apply(function(){
          $scope.logged = false;
          User.logout();
        });
      });
    };

    // run at startup
    (function(){
      console.log('Running AuthCtrl Startup Script...');
      $scope.userIsConnected = false;
      User.setAuthHeaders();
    
      // initialize facebook
      $scope.$watch(
        function() {
          return Facebook.isReady();
        },
        function(newVal) {
          if (newVal)
            $scope.facebookReady = true;
        }
      );
      
      Facebook.getLoginStatus(function(response){
        if(response.status == 'connected') {
          $scope.userIsConnected = true;
        }
      });

    })();
    
  });