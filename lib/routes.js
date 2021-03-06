/**
 * All server routes
 */

'use strict';

module.exports = function (server) {
  // require routes here
  server.route(require('./modules/user'));
  server.route(require('./modules/auth/login'));
  server.route(require('./modules/blockchain'));
};
