'use strict';
var path = require('path')
var rp = require('request-promise');
var hfc = require('fabric-client')
//hfc.addConfigFile(path.join(__dirname, 'network-config.json'));
var Boom = require('boom');
var invoke = require('./invoke')
var query = require('./query')

/**
 * Login controller
 * handles HTTP responses
 */
function BlockchainController(npcService) {
  this.npcService = npcService
}

BlockchainController.prototype = {
  /**
   * Blockchain endpoint status
   */
  index: function (req, reply) {
    reply({blockchain: 'I am alive!'})
  },

  getNpcDocForUser: function (req, reply) {
    console.log(req.params)

    this.npcService.getByUserId(req.params.userId)
    .then(function(res) {
      reply(res)
    })
    .catch(function(err) {
      console.log(err)
      replyError(reply, 400)(err)
    })
    // reply({
    //   id1: {header: 'Oetisk fond', text: require('../../../NPC_dummy')},
    //   id2: {header: 'Fingeravtrycksbetalningar', text: 'Maecenas lobortis orci vel est tempus convallis. In hac habitasse platea dictumst. Pellentesque non eros ipsum. Fusce eget tortor vel turpis luctus iaculis et in dolor. Morbi viverra augue purus, non efficitur lorem accumsan eget. Duis vel tristique lectus. Aliquam quis ipsum pharetra, ornare massa ut, condimentum erat. Maecenas tempus felis rutrum nisi gravida, a venenatis nulla condimentum. Suspendisse fermentum pretium dignissim. Ut auctor cursus massa vel semper.'},
    //   id3: {header: 'Endless returns ETF', text: 'Cras suscipit ipsum nec enim rhoncus, vel malesuada sapien semper. Proin et purus id orci dignissim dictum sed a velit. Quisque quis commodo tellus. Nulla nisi sapien, fermentum vel lacus cursus, ultrices faucibus eros. Interdum et malesuada fames ac ante ipsum primis in faucibus. Curabitur facilisis imperdiet magna, sit amet vulputate diam maximus id. Nullam commodo tincidunt sagittis. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis scelerisque scelerisque elit, ornare egestas felis tincidunt vitae.'},
    //   id4: {header: 'Cash payout fund', text: 'Integer ac risus risus. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Curabitur nibh est, lobortis eu vehicula in, egestas nec nisl. Aliquam elit lacus, aliquam quis erat eget, auctor maximus risus. Sed a malesuada nunc, sit amet rhoncus erat. Quisque molestie, lacus a tempor eleifend, purus sem iaculis lorem, eget ultrices nulla justo id dui. Cras nec mollis odio. Nullam accumsan risus quis fringilla euismod. Curabitur id mattis lacus. Aenean tincidunt ex ante, ut facilisis massa euismod sed. Nam et vestibulum velit. Cras in justo sollicitudin, dapibus quam ut, vehicula erat. Curabitur ut nunc feugiat, commodo tortor sed, bibendum mi. Nullam mattis elementum nunc, nec egestas sem tincidunt sed. Phasellus laoreet, augue ut mollis tincidunt, risus ante gravida mauris, non egestas nibh est vitae augue.'},
    //   id5: {header: 'Security loan certificate', text: 'Match number of securities and end time with interest.'}
    // })
  },

  addNpcDoc: function (req, reply) {
    console.log('adding npc to blockchain')
    console.log(req.payload)

    invoke.createNpcDocument(
      req.payload.header,
      req.payload.content,
      req.payload.signees
    ).then(function(res) {
      reply({succes: true})
    }).catch(function(err) {
      replyError(reply, 400)(err)
    })


    // //reply({status: 'success'})
    // var npcData = {
    //   header: req.payload.header,
    //   content: req.payload.content,
    //   signees: req.payload.signees
    // }
    // this.npcService.create(npcData)
    //   .then(reply)
    //   .catch(function(err) {
    //     console.log(JSON.stringify(err.error.errors))
    //     replyValidationError(reply)(err)
    //   })
  },

  signNpcDoc: function(req, reply) {
    console.log('signing document')
    console.log(req.params)
    this.npcService.signDocument(req.params.userId, req.params.npcDocId)
    .then(function(res) {
      console.log('Document signed successfully')
      reply({success: true})
    })
    .catch(function(err) {
      console.log(err)
      replyError(reply, 400)(err)
    })
  },

  commentNpcDoc: function(req, reply) {
    console.log('commenting document')
    console.log(req.params)
    console.log(req.payload)
    this.npcService.commentDocument(req.params.userId,
                                    req.params.npcDocId,
                                    req.payload.comment)
    .then(function(res) {
      console.log('Document signed successfully')
      reply({success: true})
    })
    .catch(function(err) {
      console.log(err)
      replyError(reply, 400)(err)
    })
  },







  test1: function(req, reply) {
    console.log('testing blockchain')
    registrarLogin()
    .then(function(resp) {
      console.log('login success')
      console.log(resp)
      return deployChaincode()
    })
    .then(function (resp) {
      console.log('blockchain deploy success')
      console.log(resp)
      reply({success: resp})
    })
    .catch(function(err) {
      console.log('fail')
      console.log(err)
      reply({error: err})
    })
  },

  test2: function(req, reply) {
    console.log('test invoke chaincode')
    registrarLogin()
    .then(function(resp) {
      console.log('login success')
      console.log(resp)
      return invokeChaincode()
    })
    .then(function(resp) {
      console.log('invoked chaincode success')
      reply({success: resp})
    })
    .catch(function(err) {
      console.log('failed to invoke chaincode')
      console.log(err)
      reply({error: err})
    })
  },

  test3: function(req, reply) {
    console.log('querying transaction')
    registrarLogin()
    .then(function(resp) {
      console.log('login success')
      console.log(resp)
      return queryChaincode('newValue')
    })
    .then(function(resp) {
      console.log('querying transaction success')
      console.log(resp)
      reply(resp)
    })
    .catch(function(err) {
      console.log(err)
      reply(err)
    })
  },

  test: function(req, reply) {
    console.log('write to blockchain')
    invoke.createNpcDocument('Some header', 'This is the content').then(function(res) {
      return query.car('Some header')
    }).then(function(npc) {
      console.log('npc saved')
      console.log(npc)
      reply(npc)
    })
  },

  test5: function(req, reply) {
    console.log('get transaction')
    registrarLogin()
    .then(function(resp) {
      console.log('login success')
      console.log(resp)
      return getTransaction('a53641ab-f2d9-4b86-9f20-4eb78b4fa533') //('c2769770-2876-4abf-80bf-c3293b68c8b7')
    })
    .then(function(resp) {
      console.log('get transaction success')
      console.log(resp)
      reply(resp)
    })
    .catch(function(err) {
      console.log(err)
      reply(err)
    })
  }
};





// registered user:
// body: {
//       "enrollId": "lukas",
//       "enrollSecret": "NPKYL39uKbkj"
//     }

var registrarLogin = function() {
  var options = {
    uri: 'http://localhost:7050/registrar',
    headers: {
      'User-Agent': 'Request-Promise'
    },
    json: true,
    body: {
      "enrollId": "jim",
      "enrollSecret": "6avZQLwcUe9b"
    }
  }

  return rp.post(options)
}

var write = function(key, val) {
  var options = {
    uri: 'http://localhost:7050/chaincode',
    headers: {
      'User-Agent': 'Request-Promise'
    },
    json: true,
    body: {
      "jsonrpc": "2.0",
      "method": "invoke",
      "params": {
        "type": 1,
        "chaincodeID":{
          "name": "mycc"
        },
        "input": {
          "args":["init", "a", "100", "b", "200"]
        }
      },
      "id": 1
    }
  }

  return rp.post(options)
}

var getTransaction = function(guid) {
  var options = {
    uri: 'http://localhost:7050/transactions/' + guid,
    headers: {
      'User-Agent': 'Request-Promise'
    },
    json: true,
    id: 6
  }
  return rp(options)
}

var queryChaincode = function(query) {
  var options = {
    uri: 'http://localhost:7050/chaincode',
    headers: {
      'User-Agent': 'Request-Promise'
    },
    json: true,
    body: {
      "jsonrpc": "2.0",
      "method": "query",
      "params": {
          "type": 1,
          "chaincodeID":{
              "name":"8adfdcae8239e7c7211577bd963b6bda74264b804843e9756affaa0fb6ab6743c4bee664f11bc15d36ade12c3bfac3a993963823631d92e788462d9022f76de4"
          },
          "ctorMsg": {
             "args": query,
             "function": "read"
          },
          "secureContext": "lukas"
      },
      "id": 5
    }
  }

  return rp.post(options)
}

var invokeChaincode = function() {
  var options = {
    uri: 'http://localhost:7050/chaincode',
    qs: {
      access_token: 'xxxxx xxxxx'
    },
    headers: {
      'User-Agent': 'Request-Promise'
    },
    json: true,
    body: {
      "jsonrpc": "2.0",
      "method": "invoke",
      "params": {
        "type": 1,
        "chaincodeID":{
          "name":"8adfdcae8239e7c7211577bd963b6bda74264b804843e9756affaa0fb6ab6743c4bee664f11bc15d36ade12c3bfac3a993963823631d92e788462d9022f76de4"
        },
        "ctorMsg": {
          "function": "init",
          "args": ["a", "100"]
        },
        "secureContext": "lukas"
      },
      "id": 3
    }
  }

  return rp.post(options)
}

// Blockchain test deploy chaincode
var deployChaincode = function() {
  var options = {
    uri: 'http://localhost:7054/chaincode',
    qs: {
      access_token: 'xxxxx xxxxx' // -> uri + '?access_token=xxxxx%20xxxxx'
    },
    headers: {
      'User-Agent': 'Request-Promise'
    },
    json: true, // Automatically parses the JSON string in the response
    body: {
      "jsonrpc": "2.0",
      "method": "deploy",
      "params": {
        "type": 1,
        "chaincodeID":{
            "path":"https://github.com/BLCKtech/chaincode"
        },
        "ctorMsg": {
            "args":["init", "a", "1000", "b", "2000"]
        },
        "secureContext": "lukas"
      },
      "id": 1
    }
  };

  return rp.post(options)
}

/**
 * Reply a Boom error
 * code defaults to 500
 */
function replyError(reply, code) {
  return function (err) {
    reply(Boom.wrap(err, code));
  };
}

/**
 * Reply a Boom.badData error
 */
function replyValidationError(reply) {
  return function (err) {
    var e = Boom.badData(err.message);
    // Handle mongoose validation error
    if (err.errors) {
      e.output.payload.errors = err.errors;
    }
    reply(e);
  };
}

module.exports = BlockchainController
