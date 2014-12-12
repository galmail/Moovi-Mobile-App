/**
 * Event Service.
 *
 */

moovi.services.factory('Event', function($http, Util) {
  
  var _events = [];

  return {

    getEvents: function(){
      return _events;
    },

    loadEvents: function(callback){
      $http.get('/api/v1/events')
      .success(function(data){
        console.log('events loaded.');
        _events = data.events;
        callback(_events);
      })
      .error(function(data){
        console.log('error loading events');
        callback(null);
      });
    },

    save: function(ocassion, callback){
      if(ocassion.eventId){
        callback(ocassion.eventId);
      }
      else {
        // save custom event
        $http.post('/api/v1/events',{
          name: ocassion.eventName,
          custom: true,
          active: true
        })
        .success(function(data){
          callback(data.id);
        })
        .error(function(data){
          console.log('error saving custom event');
          callback(null);
        });
      }
    }

  };

});