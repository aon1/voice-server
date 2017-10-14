var express = require('express');
var app = express();
var contacts = require('./routes/contacts');
var users = require('./routes/users');
var batch = require('./routes/batch');
var batchMedia = require('./routes/batchmedia');
var callDetail = require('./routes/calldetail');
let survey = require('./routes/survey')
var path = require('path');
global.appRoot = path.resolve(__dirname);

app.use('/contacts', contacts);
app.use('/users', users);
app.use('/batch', batch);
app.use('/batch-media', batchMedia);
app.use('/call-details', callDetail);
app.use('/surveys', survey);
module.exports = app;