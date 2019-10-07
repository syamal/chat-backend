const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const ChannelSchema = new Schema({
  participants: {
    type: Array,
    required: true
  }
});

module.exports = Channel = mongoose.model('channel', ChannelSchema);
[String]