var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.json());
var models = require('../models/index');
var client = require('../asterisk/asterisk-client');
//var cli = require('../asterisk/client');
var Contact = models.Contact;

router.post('', function (request, res, next) {
    var contact = Contact.build(request.body);
    contact.validate()
        .catch(function (err) {
            console.log(err);
            res.status(400).json(err)
        });

    contact.save()
        .then((created, err) => {
            if (err) {
                res.status(400).json(err)
            } else {
                res.status(201).json(created)
            }
        })
        .catch(function (err) {
            console.log(err);
            //res.status(500).json(err)
        });



});

router.get('', function (request, res, next) {

    Contact.findAll()
        .then((contacts, err) => {
            if (err) {
                res.status(500).json(err)
            } else {
                res.status(200).json(contacts)
            }
        })
        .catch(function(err){
            console.log(err);
            res.status(500).json(err)
        })

})

router.post('/call', function (request, res, next) {
    console.log(request.params);
    client.createChannel();

    res.status(200).json({ "status": "ok" });

});

module.exports = router;