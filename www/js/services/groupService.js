/**
 * Group Service.
 *
 */

moovi.services.factory('Group', function($http) {
  
  var _groups = [];

  return {

    getGroups: function(){
      return _groups;
    },

    save: function(groupData, callback){
      $http.post('/api/v1/groups',groupData)
      .success(function(data){
        callback(data.id);
      })
      .error(function(data){
        console.log('error saving participants');
        callback(null);
      });
    },

    sendInvitations: function(groupData, callback){
      this.save(groupData,function(groupId){
        if(groupId){
          callback(groupId);
        }
        else {
          console.log('error sending invitations');
          callback(null);
        }
      });
    }

  };

});