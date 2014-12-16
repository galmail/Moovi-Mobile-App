/**
 * Create Video Controller.
 *
 */

moovi.controllers.controller('CreateVideoCtrl', function($scope, $ionicSlideBoxDelegate, Event, Facebook) {
	

	//////////// VIDEO DATA ////////////

	$scope.videoData = {
		id: null,
		receiver: {
			first_name: null,
			last_name: null,
			email: null,
			gender: 'M',
			birthdate: null
		},
		ocassion: {
			eventId: null,
			eventName: 'Birthday',
			eventDate: null,
			customEvent: false
		},
		cover: 'img/image_not_available.jpg',
		clip: null,
		participants: []
	};

	//////////// SELECT EVENT SLIDE ////////////

	var loadEvents = function(){
		Event.loadEvents(function(events){
			$scope.events = events;
		});
	};

	$scope.showOtherOcassion = function(){
		if(!$scope._otherOcassion){
			$scope._otherOcassion=true;
			$scope.videoData.ocassion.eventId=null;
			$scope.videoData.ocassion.customEvent=true;
			$scope.videoData.ocassion.eventName=null;
		}
		$scope._otherOcassionColor = 'color:black;';
	};

	$scope.hideOtherOcassion = function(ev){
		$scope._otherOcassionColor = 'color:white;';
		$scope._otherOcassion=false;
		$scope.videoData.ocassion.customEvent=false;
		if(ev)
			$scope.videoData.ocassion.eventName=ev.name;
	};

	//////////// SLIDES NAVIGATION ////////////

	$scope.firstSlide = function(){
		return ($ionicSlideBoxDelegate.currentIndex() == 0);
	};

	$scope.lastSlide = function(){
		return ($ionicSlideBoxDelegate.slidesCount()-$ionicSlideBoxDelegate.currentIndex()==1);
	};

	$scope.nextSlide = function(){
		$ionicSlideBoxDelegate.next();
	};

	$scope.previousSlide = function(){
		$ionicSlideBoxDelegate.previous();
	};















	// runs when controller is called
	(function(){
		loadEvents();
		$scope.hideOtherOcassion();
	})();


	
	












	// Facebook.api('/me', function(data) {
 //    console.log(JSON.stringify(data));
 //  });

	// Facebook.api('/search?q=dubitski&type=user', function(data) {
 //    console.log(JSON.stringify(data));
 //  });  

	//https://graph.facebook.com/search?q=mark&type=user


	// handle create video function

	// validate all video fields

	






});
