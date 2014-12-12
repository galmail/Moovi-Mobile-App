/**
 * Video Service.
 *
 */

moovi.services.factory('Video', function($http, filterFilter, User, Event, Clip, Group) {
  
  var videos = [];
  
  return {

  	save: function(videoData,callback){

  		myVideo = {
  			id: videoData.id,
        receiver_id: null,
        event_id: null,
        event_celebration_date: null,
        title: null,
        cover: null
  		};

  		// store the receiver as a user guest if not already created
  		User.createGuest(videoData.receiver,function(guestId,msg){
  			if(guestId!=null){
  				myVideo.receiver_id = guestId;
  				// store the event
          Event.save(videoData.ocassion,function(eventId,msg){
            if(eventId!=null){
              myVideo.event_id = eventId;
              myVideo.event_celebration_date = videoData.ocassion.eventDate;
              
              // store video clip
              if(videoData.clip){
                Clip.save({ id: videoData.clip_id, url: videoData.clip, video_id: videoData.id}, function(clipId){
                  videoData.clip_id = clipId;
                });
              }

              // store video participants
              Group.save({
                video_id: videoData.id,
                people: filterFilter(videoData.participants,{hidden: false})
              }, function(groupId){
                videoData.group_id = groupId;
              });

              // title and cover
              myVideo.title = videoData.title;
              myVideo.cover = videoData.cover;
              // save video
              $http.put('/api/v1/videos/'+myVideo.id+'.json',myVideo)
              .success(function(){ callback(true); })
              .error(function(msg){ callback(false,msg.error); });
            }
            else {
              callback(false,msg);
            }
          });
  			}
  			else {
  				callback(false,msg);
  			}
  		});

  	}

  };

});