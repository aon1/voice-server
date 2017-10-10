'use strict';
let settings = require('../config/asterisk-config');
let path = require('path');
let Client = require('ssh2-sftp-client');
let logger = require('../config/logger');
let sftp = new Client();



function Media() {

}

Media.prototype.upload = function (filename) {
    logger.debug(filename);
    sftp.connect({
        host: settings.ASTERISK_SERVER_HOST,
        port: settings.ASTERISK_SERVER_PORT,
        username: settings.ASTERISK_SERVER_USERNAME,
        password: settings.ASTERISK_SERVER_PASSWORD
    }).then(() => {
        sftp.put(path.join(__dirname, "../uploads/", filename), "/var/lib/asterisk/sounds/" + filename).then(() => {
            logger.info("Uploaded successfully");
        }).catch((err) => {
            logger.error(err, 'catch error');
        });
    }).catch((err) => {
        logger.error(err, 'catch error');
    })
}

module.exports = new Media();