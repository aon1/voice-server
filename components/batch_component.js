'use strict';
var client = require('../asterisk/asterisk-client');
var models = require('../models/index');
var Batch = models.Batch;
var Contact = models.Contact;

function BatchComponent () {

}

BatchComponent.prototype.process = function (batch) {
    return new Promise(function (resolve, reject) {
        var contacts = Contact.findAll({
            where: {
                batchId: batch.id
            }
        }).then((contacts, err) => {
            if (err) {
                console.log("Error retrieving contacts for batch");
                reject(err);
            } else {
                contacts.forEach(function (contact) {
                    
                    client.createChannel(contact);
                });
                resolve(contacts);
            }
        }).catch(function (err) {
            console.log(err);
            reject(err);

        });

    });  
}
module.exports = new BatchComponent();
