/**
 * Video controller.
 *
 */

moovi.controllers.controller('VideoCtrl', function($ionicViewService, $scope, $state, $stateParams, $ionicModal, $http, $ionicBackdrop, $timeout, $ionicSlideBoxDelegate, filterFilter, Facebook, Util, User, Video, Event, Group, Clip) {

	$scope.videos = [];

	$scope.coverMaxHeight = window.innerWidth + 'px';
	$scope.videoData = {
		id: $stateParams.videoId,
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


  if($state.current.action == 'show'){
		
	}
	else if($state.current.action == 'edit'){
		Event.loadEvents(function(events){
			$scope.events = events;
		});
	}
	else if($state.current.action == 'join'){



	}
	else {
		//$scope.loadVideos();
	}


	// $scope.loadVideos = function(){
	// 	//$scope.show();
	// 	$http.get('/api/v1/videos.json').success(function(data){
	// 		$scope.videos = data;
	// 		if(data){
	// 			console.log('Fetched videos: ' + JSON.stringify(data));
	// 		}
	// 		else {
	// 			console.log('no videos available...');
	// 		}
	// 		//$scope.hide();
	// 	});
	// };

	$scope.pickContact = function(callback){
		if(navigator.contacts){
			navigator.contacts.pickContact(callback);
		}
		else {
			alert('Download the app to select from contact list');
		}
	};

	$scope.selectReceiverFromContactList = function(){
		$scope.pickContact(function(contact){
			alert(JSON.stringify(contact));
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
	$scope.hideOtherOcassion();	

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

	$scope.videoClipCover = 'img/video_not_available.png';
	$scope.uploadCompleteCallback = function(){
		Util.showLoading('Please wait...');
		setTimeout(function(){
			if($scope.videoData.clip){
				$scope.videoClipCover = 'img/play.jpg';
				
				if($state.current.action == 'join'){
					// upload clip to server
					Clip.uploadAsGuest({
						id: $scope.videoData.clipId,
						url: $scope.videoData.clip,
						video_id: $stateParams.videoId,
						user_id: $stateParams.userId
					},function(clipId){
						if(clipId){
							$scope.videoData.clipId = clipId;
							alert('Clip Uploaded Successfully!');
						}
						else {
							alert('Clip could not be saved, please try again.');
						}
					});
				}
			}
			Util.hideLoading();
		}, 3000);
	};

	// Create the participant modal
  $ionicModal.fromTemplateUrl('js/templates/participant.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

	$scope.openContactDetails = function(i){
		$scope.selectedParticipantIndex = i;
		$scope.selectedParticipant = angular.copy($scope.videoData.participants[i]);
		$scope.modal.show();
	};

	$scope.closeContactDetails = function(){
		$scope.modal.hide();
	};

	$scope.saveContactDetails = function(){
		// validate email first
		if(!Util.validateEmail($scope.selectedParticipant.email)){
			alert('Not a valid email');
			return false;
		}
		if($scope.selectedParticipantIndex == -1){
			$scope.videoData.participants.unshift($scope.selectedParticipant);
		}
		else {
			$scope.videoData.participants[$scope.selectedParticipantIndex] = $scope.selectedParticipant;
		}
		$scope.closeContactDetails();
	};

	$scope.removeContactFromGroup = function(){
		$scope.videoData.participants[$scope.selectedParticipantIndex].hidden = true;
		$scope.closeContactDetails();
	};

	$scope.pickContactToGroup = function(){
		$scope.pickContact(function(contact){
			alert(JSON.stringify(contact));
		});
	};

	$scope.addContactToGroup = function(){
		$scope.selectedParticipantIndex = -1;
		$scope.selectedParticipant = { hidden: false };
		$scope.modal.show();
	};

	$scope.inviteGroup = function(){
		console.log('invite group');
		Util.showLoading('Sending Invitations...');
		// save video first
		Video.save($scope.videoData,function(ok,msg){
			if(ok){
				// send invitations
				Group.sendInvitations({
					invite_group: true,
					video_id: $scope.videoData.id,
		      people: filterFilter($scope.videoData.participants,{hidden: false})
				},function(groupId){
					Util.hideLoading();
					if(groupId){
						$scope.videoData.group_id = groupId;
						alert('Invitations Sent!');
					}
					else {
						alert('Could not send invitations, please check your connection and try again.');
					}
				});
			}
		});
	};

	$scope.sendInvitationToContact = function(){
		console.log('sendInvitationToContact');
		//User.inviteContact($scope.selectedParticipant);
		$scope.closeContactDetails();
	};

  $scope.createNewVideo = function() {
    // save new video and get videoId from server
    Util.showLoading('Setting Up Video...');
    $http.post('/api/v1/videos.json')
    .success(function(data){
      Util.hideLoading();
      var videoId = data.id;



      var unregisterListener;
      var listenForStateChange = function () {
        unregisterListener = $scope.$on('$stateChangeStart', function() {
          $ionicViewService.nextViewOptions({
            disableAnimate: true,
            disableBack: true
          });
          unregisterListener();
        });
        window.setTimeout(unregisterListener, 300);
      };

      listenForStateChange();
      //$state.go('app.editVideo');
      window.location.href = "#/app/edit-video/" + videoId;
    })
    .error(function(data){
      Util.hideLoading();
      if(data.error){
        alert('Please login to create video.');
      }
      else {
        alert('Communication error with the server, please try again in few minutes.');
      }
    });
  };

	$scope.saveVideo = function(){
		console.log('saveVideo');
		//$scope.videoData.people = filterFilter($scope.videoData.participants,{hidden: false});
		Util.showLoading('Saving Video...');
		Video.save($scope.videoData,function(ok,msg){
			Util.hideLoading();
			if(ok){
				alert('Video Saved Successfully!');
			}
			else {
				alert(msg);
			}
		});
	};

  	  

});
