var client = require('ari-client');
var asteriskApp = 'voice-server';
var settings = require('../config/asterisk-config');
let logger = require('../config/logger');

let ariInstance;

client.connect(settings.ASTERISK_ARI_URL, settings.ASTERISK_ARI_USERNAME, settings.ASTERISK_ARI_PASSWORD)
    .then(function (ari) {
        ariInstance = ari;
        ariInstance.start(asteriskApp);
        logger.debug("Created connection successfully")
    })
    .catch(function (err) {
        logger.debug(err);
        throw err;
    });


client.createChannel = function (contact) {
    var endpoint = "PJSIP/" + contact.phoneNumber;
    client.ariInstance = ariInstance;
    return ariInstance.channels.create({ endpoint: endpoint, app: asteriskApp, appArgs: 'dialed' })
}


module.exports = client;