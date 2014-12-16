// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js

var moovi = angular.module('moovi',['ionic','facebook','ngS3upload','moovi.controllers','moovi.services','moovi.directives']);
moovi.controllers = angular.module('moovi.controllers', []);
moovi.services = angular.module('moovi.services', []);
moovi.directives = angular.module('moovi.directives', []);

moovi.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($sceDelegateProvider) {
  $sceDelegateProvider.resourceUrlWhitelist([
    // Allow same origin resource loads.
    'self',
    // Allow loading from our assets domain.  Notice the difference between * and **.
    'https://*.s3.amazonaws.com/**'
  ]);

  // The blacklist overrides the whitelist so the open redirect here is blocked.
  $sceDelegateProvider.resourceUrlBlacklist([
    
  ]);
})

.config(function(FacebookProvider) {
   var fbAppId = '';
   if(window.location.href.indexOf('localhost')>0){
    fbAppId = '854877257866349';
   }
   else {
    fbAppId = '672126826238840';
   }
   FacebookProvider.init(fbAppId);
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('app', {
    url: "/app",
    abstract: true,
    templateUrl: "js/templates/_menu.html",
    controller: 'AuthCtrl'
  })

  .state('app.splash', {
    url: "/splash",
    views: {
      'menuContent' :{
        templateUrl: "js/templates/splash.html"
      }
    }
  })

  .state('app.login', {
    url: "/login",
    views: {
      'menuContent' :{
        templateUrl: "js/templates/login.html",
        controller: 'AuthCtrl'
      }
    }
  })

  .state('app.videos', {
    url: "/videos",
    views: {
      'menuContent' :{
        templateUrl: "js/templates/videos.html",
        controller: 'VideosCtrl'
      }
    }
  })

  .state('app.previewVideo', {
    action: 'show',
    url: "/show-video/:videoId",
    views: {
      'menuContent' :{
        templateUrl: "js/templates/video-preview.html",
        controller: 'VideoCtrl'
      }
    }
  })


  .state('app.createVideo', {
    url: "/create-video",
    views: {
      'menuContent' :{
        templateUrl: "js/templates/video-create.html",
        controller: 'CreateVideoCtrl'
      }
    }
  })


  .state('app.editVideo', {
    action: 'edit',
    url: "/edit-video/:videoId",
    views: {
      'menuContent' :{
        templateUrl: "js/templates/video-edit.html",
        controller: 'VideoCtrl'
      }
    }
  })


  .state('app.joinVideo', {
    action: 'join',
    url: "/join-video/:videoId/:userId",
    views: {
      'menuContent' :{
        templateUrl: "js/templates/video-join.html",
        controller: 'VideoCtrl'
      }
    }
  })
  .state('app.settings', {
    url: "/settings",
    views: {
      'menuContent' :{
        templateUrl: "js/templates/settings.html",
        controller: 'SettingsCtrl'
      }
    }
  })
  .state('app.about', {
    url: "/about",
    views: {
      'menuContent' :{
        templateUrl: "js/templates/about.html"
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/videos');

});

