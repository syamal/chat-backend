const bcrypt = require('bcryptjs');
const config = require('config');
const jwt = require('jsonwebtoken');
var util = require('util');


// Channel Model
const Channel = require('../models/channel');
const Message = require('../models/message');


// Store New Message 

exports.postMessage = async (req, res) => {
  
  const { user_id, to, message } = req.body;

  // Simple validation
  if(!to || !message) {
    return res.status(400).json({ msg: 'Bad Request' });
  }

  let participants = [user_id, to];

  // Check history and fetch new/existing channel id
  let channel = await Channel.find({$and: [{ participants: user_id}, {participants: to }] }) 
  
  if(channel.length === 0) {
    const newChannel = new Channel({
      participants
    });

    let new_chan = await newChannel.save();

    channel = Array(new_chan);

  } 


  if(channel[0]._id) {
    const newMessage = new Message({
      channel_id:channel[0]._id,
      from: user_id,
      to: to,
      message: message
    });

    newMessage.save().then( msg => {
      global.io.emit(channel[0]._id, {
        channel_id:channel[0]._id,
        from: user_id,
        to: to,
        message: message
      });

      res.send("Message sent successfully");
    });

  } else {
    res.status(400).send("Bad Request");
  }  
  
  
};

// Get All Messages 

exports.getAllMessagesForTheClient = async (req, res) =>  {

  const { user_id, to } = req.body;

  let participants = [user_id, to];

  // Check history and fetch new/existing channel id
  let channel = await Channel.find({$and: [{ participants: user_id}, {participants: to }] }) 
  
  if(channel.length === 0) {
    return res.status(200).json({ count: channel.length, messages: [] });
  } else {
    let messages = await Message.find({ channel_id: channel[0]._id}).select(['-__v','-_id']);    
    
    return res.status(200).json({ count: messages.length, messages: messages });
  }  
};


