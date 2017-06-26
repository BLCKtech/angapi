'use strict';

var q = require('bluebird');

var commonErrorTypes = require('../../common-error-types');

/**
 * User service
 */
function NpcService(NpcModel) {
  this.NpcModel = NpcModel;
}

NpcService.prototype = {
  /**
   * Get list of users
   */
  get: function () {
    
  },

  /**
   * Creates a new user
   */
  create: function (data) {
    var deferred = q.pending();
    var newNpc = new this.NpcModel(data);

    newNpc.save(function (err, npc) {
      var token;
      if (err) {
        deferred.reject({error: err});
      } else {
        deferred.resolve({id: npc._id});
      }
    }.bind(this));

    return deferred.promise;
  },

  /**
   * Get a single user
   */
  getByUserId: function (userId) {
    var deferred = q.pending();

    this.NpcModel.find({ 'signees.signee': { $all: [userId] } })
    .populate('signees.signee')
    .populate('comments.commentator')
    .exec(function(err, npc) {
      if (err) {
        deferred.reject(new commonErrorTypes.QueryError);
      } else if (!npc) {
        deferred.reject({error: 'Npc not found'});
      } else {
        deferred.resolve(npc);
      }
    })

    return deferred.promise;
  },

  signDocument: function(userId, npcdocId) {
    var deferred = q.pending();

    this.NpcModel.findOneAndUpdate(
    { "_id": npcdocId, "signees.signee": userId },
    {"$set": {
        "signees.$.hasSigned": true
      }
    },
    function(err, res) {
      if (err) {
        deferred.reject(new commonErrorTypes.QueryError)
      } else {
        deferred.resolve(res)
      }
    });
    return deferred.promise;
  },

  commentDocument: function(userId, npcdocId, comment) {
    var deferred = q.pending();

    this.NpcModel.findByIdAndUpdate(
      npcdocId,
      {$push: {"comments": {commentator: userId, comment: comment}}},
      {safe: true, upsert: true, new : true},
      function(err, res) {
        if (err) {
          deferred.reject(new commonErrorTypes.QueryError)
        } else {
          deferred.resolve(res)
        }
      })

    return deferred.promise;
  },

  /**
   * Deletes a user
   */
  removeById: function (userId) {
    var deferred = q.pending();

    this.UserModel.findByIdAndRemove(userId, function (err) {
      if (err) {
        deferred.reject(new commonErrorTypes.QueryError);
      } else {
        deferred.resolve();
      }
    }.bind(this));

    return deferred.promise;
  },

  /**
   * Get my info
   */
  me: function (userId) {
    var deferred = q.pending();

    this.UserModel.findOne({
      _id: userId
    }, '-salt -hashedPassword', function (err, user) {
      if (err) {
        deferred.reject(new commonErrorTypes.QueryError);
      } else if (!user) {
        deferred.reject(new userErrorTypes.UserNotFound);
      } else {
        deferred.resolve(user);
      }
    });

    return deferred.promise;
  }
};

module.exports = NpcService;
