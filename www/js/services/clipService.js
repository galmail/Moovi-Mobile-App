/**
 * Clip Service.
 *
 */

moovi.services.factory('Clip', function($http) {
  
  var _clips = [];

  return {

    getClips: function(){
      return _clips;
    },

    loadClips: function(callback){
      $http.get('/api/v1/clips')
      .success(function(data){
        console.log('clips loaded.');
        _clips = data.clips;
        callback(_clips);
      })
      .error(function(data){
        console.log('error loading clips');
        callback(null);
      });
    },

    save: function(clipData, callback){
      var url = null;
      if(clipData.id){
        url = $http.put('/api/v1/clips/'+clipData.id,clipData);
      }
      else {
        url = $http.post('/api/v1/clips',clipData);
      }
      url.success(function(data){
        callback(data.id);
      })
      .error(function(data){
        console.log('error saving custom event');
        callback(null);
      });
    },

    uploadAsGuest: function(clipData, callback){
      $http.post('/api/v1/upload_guest_clip',clipData)
      .success(function(data){
        callback(data.id);
      })
      .error(function(data){
        console.log('Error uploading clip as guest');
        callback(null);
      });
    }

  };

});