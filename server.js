'use strict';

const express = require('express');
var app       =     express();
var http      =     require('http').Server(app);
var io        =     require("socket.io")(http);

global.io = io;

const mongoose = require('mongoose');
const config = require('config');
const path = require('path');


const dbURI = config.get('mongoURI');
const PORT = process.env.PORT || 3000;


mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

let db = mongoose.connection;

/*Check connection*/
db.once('open', function () {
    console.log("Connected to the Database");
});



app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

var bodyParser = require('body-parser');
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));


// APIs for React App

const userRoute = require('./routes/user');
const messageRoute = require('./routes/message');


// user routes
app.use('/user', userRoute);
app.use('/message', messageRoute);


// Serve React App
app.use(express.static(path.join(__dirname, 'build')));

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});


var server = app.listen(PORT, () => {
    console.log('Server runs on port ' + PORT + "!");
});