'use strict';
var client = require('../asterisk/asterisk-client');
var models = require('../models/index');
var Batch = models.Batch;
var Contact = models.Contact;

function BatchComponent () {

}

BatchComponent.prototype.process = function (batch) {
    var contacts = Contact.findAll({
        where: {
            batchId: batch.id
        }
    }).then((batches, err) => {
        if (err) {
            res.status(500).json(err)
        } else {
            res.status(200).json(batches)
        }
    }).catch(function (err) {
        console.log(err);
        res.status(500).json(err)
    });

    console.log(contacts);
}
module.exports = new BatchComponent();
