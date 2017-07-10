var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.json());
var models = require('../models/index');
var client = require('../asterisk/asterisk-client');
//var cli = require('../asterisk/client');
var Contact = models.Contact;

router.post('/', function (request, res, next) {

    Contact.create({
        firstName: request.body['firstName'],
        lastName: request.body['lastName'],
        phoneNumber: request.body['phoneNumber'],
        email: request.body['email'],
    }).then((created, err) => {
        if (err){
            res.status(500).json(err)
        } else {
            res.status(200).json(created)
        }
    }) 
        
});

router.post('/call', function (request, res, next) {
    console.log(request.params);
    client.createChannel();
    
    res.status(200).json({"status" : "ok"});
        
});

module.exports = router;