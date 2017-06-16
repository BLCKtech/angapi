'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var signeeSchema = new Schema({
  signee: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  hasSigned: {
    type: Boolean,
    default: false
  }
})

var NpcSchema = new Schema({
  header: String,
  content: String,
  signees: [signeeSchema]
});

/**
 * Validations
 */

// Validate empty header
NpcSchema
  .path('header')
  .validate(function (titel) {
    return titel.length;
  }, 'header cannot be blank');

// Validate empty content
NpcSchema
  .path('content')
  .validate(function (content) {
    return content.length;
  }, 'Content cannot be blank');

// Validate header is not taken
NpcSchema
  .path('header')
  .validate(function (value, respond) {
    var that = this;
    this.constructor.findOne({header: value}, function (err, npc) {
      if (err) {
        throw err;
      }
      if (npc) {
        if (that.id === npc.id) {
          return respond(true);
        }
        return respond(false);
      }
      respond(true);
    });
}, 'The specified header is already in use.');

var validatePresenceOf = function(value) {
  return value && value.length;
};

module.exports = mongoose.model('Npc', NpcSchema);
