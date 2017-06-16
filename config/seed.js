/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var User = require('../lib/modules/user/user-model');
var Npc = require('../lib/modules/blockchain/npc-model')

User.find({}).remove(function() {
  User.create({
    provider: 'local',
    name: 'Test User',
    email: 'test@test',
    password: 'test'
  }, {
    provider: 'local',
    name: 'Admin',
    email: 'admin@admin.com',
    password: 'admin',
    role: 'admin'
  }, {
    provider: 'local',
    name: 'anke05',
    email: 'anke05@handelsbanken.se',
    password: 'hej'
  }, {
    provider: 'local',
    name: 'towe02',
    email: 'towe02@handelsbanken.se',
    password: 'hej'
  }, function() {
      console.log('> Finished populating users');
    }
  );
});

Npc.find({}).remove(function() {
  console.log('> Finished removing npc docs')
})


