'use strict';

var NpcModel = require('./npc-model');
var NpcService = require('./npc-service');
var BlockchainController = require('./blockchain-controller')

var npcService = new NpcService(NpcModel);
var blockchainCtrl = new BlockchainController(npcService)

module.exports = [
  {
    method: 'GET',
    path: '/blockchain',
    handler: blockchainCtrl.index
  },
  {
    method: 'GET',
    path: '/blockchain/npcdoc/{userId}',
    config: {
      handler: blockchainCtrl.getNpcDocForUser,
      bind: blockchainCtrl
    }
  },
  {
    method: 'POST',
    path: '/blockchain/npcdoc',
    config: {
      handler: blockchainCtrl.addNpcDoc,
      bind: blockchainCtrl
    }
  },
  {
    method: 'GET',
    path: '/blockchain/npcdoc/sign/{npcDocId}/{userId}',
    config: {
      handler: blockchainCtrl.signNpcDoc,
      bind: blockchainCtrl
    }
  },
  {
    method: 'GET',
    path: '/blockchain/test',
    handler: blockchainCtrl.test
  }
];
