'use strict';
let client = require('../asterisk/client');
let models = require('../models/index');
let Contact = models.Contact;
let CallDetail = models.CallDetail;
let logger = require('../config/logger');
let surveyComponent = require('survey_component');

function BatchComponent() {

}

BatchComponent.prototype.process = function (batch, survey) {
    return new Promise(function (resolve, reject) {
        Contact.findAll({
            where: {
                batchId: batch.id
            }
        }).then((contacts, err) => {
            if (err) {
                logger.error("Error retrieving contacts for batch");
                reject(err);
            } else {
                contacts.forEach(function (contact) {
                    CallDetail.create({
                        contactId: contact.id
                    }).then((callDetail) => {
                        client.createChannel(contact)
                            .then((channel) => {
                                channel.on('ChannelStateChange', function (event) {
                                    logger.debug("Channel changed to up:")
                                    if (event.channel.state === 'Up') {
                                        callDetail.timeStarted = new Date();
                                        callDetail.save();
                                        surveyComponent.process(client, channel, survey, callDetail);
                                    }
                                });
                                channel.on('StasisEnd', function (event) {
                                    logger.debug("Stasis End on channel");
                                    callDetail.timeEnded = new Date();
                                    callDetail.save();
                                    contact.status = "COMPLETE";
                                    contact.save();
                                });

                            });
                    });

                });
                batch.status = "COMPLETE";
                batch.save();
                resolve(contacts);
            }
        }).catch(function (err) {
            //console.log(err);
            reject(err);

        });

    });
}
module.exports = new BatchComponent();
