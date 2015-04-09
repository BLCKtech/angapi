'use strict';

var q = require('bluebird');
var jwt = require('jsonwebtoken');
var config = require('../../config/environment');

/**
 * User service
 */
function UserService(UserModel, commonErrorTypes, userErrorTypes) {
  this.UserModel = UserModel;
  this.commonErrorTypes = commonErrorTypes;
  this.userErrorTypes = userErrorTypes;
}

UserService.prototype = {
  /**
   * Get list of users
   */
  get: function () {
    var deferred = q.pending();

    this.UserModel.find({}, '-salt -hashedPassword', function (err, users) {
      if (err) {
        deferred.reject(new this.commonErrorTypes.QueryError);
      } else {
        deferred.resolve(users);
      }
    }.bind(this));

    return deferred.promise;
  },

  /**
   * Creates a new user
   */
  create: function (data) {
    var deferred = q.pending();
    var newUser = new this.UserModel(data);

    newUser.provider = 'local';
    newUser.role = 'user';
    newUser.save(function (err, user) {
      var token;
      if (err) {
        deferred.reject(new this.userErrorTypes.ValidationError(err));
      } else {
        token = jwt.sign({_id: user._id}, config.secrets.session, {expiresInMinutes: 60 * 5});
        deferred.resolve({token: token});
      }
    }.bind(this));

    return deferred.promise;
  },

  /**
   * Get a single user
   */
  getById: function (userId) {
    var deferred = q.pending();

    this.UserModel.findById(userId, function (err, user) {
      if (err) {
        deferred.reject(new this.commonErrorTypes.QueryError);
      } else if (!user) {
        deferred.reject(new this.userErrorTypes.UserNotFound);
      } else {
        deferred.resolve(user);
      }
    }.bind(this));

    return deferred.promise;
  },

  /**
   * Get a user profile
   */
  getProfile: function (userId) {
    var deferred = q.pending();

    this.getById(userId)
      .then(function (user) {
        deferred.resolve(user.profile);
      }, deferred.reject.bind(deferred));

    return deferred.promise;
  },

  /**
   * Deletes a user
   */
  removeById: function (userId) {
    var deferred = q.pending();

    this.UserModel.findByIdAndRemove(userId, function (err) {
      if (err) {
        deferred.reject(new this.commonErrorTypes.QueryError);
      } else {
        deferred.resolve();
      }
    }.bind(this));

    return deferred.promise;
  },

  /**
   * Change a users password
   */
  changePassword: function (user, oldPassword, newPassword) {
    var deferred = q.pending();
    oldPassword = String(oldPassword);
    newPassword = String(newPassword);

    this.getById(user._id)
      .then(function () {
        if (user.authenticate(oldPassword)) {
          user.password = newPassword;
          user.save(function (err) {
            if (err) {
              deferred.reject(new this.userErrorTypes.ValidationError(err));
            } else {
              deferred.resolve();
            }
          }.bind(this));
        } else {
          deferred.reject(new this.userErrorTypes.AuthenticationError);
        }
      }.bind(this), deferred.reject.bind(deferred));

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
        deferred.reject(new this.commonErrorTypes.QueryError);
      } else if (!user) {
        deferred.reject(new this.userErrorTypes.UserNotFound);
      } else {
        deferred.resolve(user);
      }
    }.bind(this));

    return deferred.promise;
  }
};

module.exports = UserService;
