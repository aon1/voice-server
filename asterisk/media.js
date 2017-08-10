'use strict';
let path = require('path');
let Client = require('ssh2-sftp-client');
let sftp = new Client();



function Media() {

}

Media.prototype.upload = function (filename) {
    console.log(filename);
    sftp.connect({
        host: '192.168.56.2',
        port: '22',
        username: 'emeka',
        password: 'noidea'
    }).then(() => {
        sftp.put(path.join(__dirname, "../uploads/", filename), "/var/lib/asterisk/sounds/" + filename).then(() => {
            console.log("Uploaded successfully");
        }).catch((err) => {
            console.log(err, 'catch error');
        });
    }).catch((err) => {
        console.log(err, 'catch error');
    })
}

module.exports = new Media();