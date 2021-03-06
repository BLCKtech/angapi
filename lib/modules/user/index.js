'use strict';

var UserModel = require('./user-model');
var UserService = require('./user-service');
var UserController = require('./user-controller');

var userService = new UserService(UserModel);
var userController = new UserController(userService);

module.exports = [
  {
    method: 'GET',
    path: '/users',
    config: {
      handler: userController.index,
      bind: userController,
      auth: {
        strategy: 'simple',
        scope: 'user'
      }
    }
  },
  {
    method: 'DELETE',
    path: '/users/{id}',
    config: {
      handler: userController.destroy,
      bind: userController,
      auth: {
        strategy: 'simple',
        scope: 'admin'
      }
    }
  },
  {
    method: 'GET',
    path: '/users/me',
    config: {
      handler: userController.me,
      bind: userController,
      auth: {
        strategy: 'simple'
      }
    }
  },
  {
    method: 'PUT',
    path: '/users/{id}/password',
    config: {
      handler: userController.changePassword,
      bind: userController,
      auth: {
        strategy: 'simple'
      }
    }
  },
  {
    method: 'GET',
    path: '/users/{id}',
    config: {
      handler: userController.show,
      bind: userController,
      auth: {
        strategy: 'simple'
      }
    }
  },
  {
    method: 'POST',
    path: '/users',
    handler: userController.create,
    config: {
      bind: userController
    }
  }
];
