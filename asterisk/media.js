'use strict';

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
        sftp.put("C:/Users/emeka/Documents/example.gsm", "/var/lib/asterisk/sounds/example1.gsm").then(() => {
            console.log("Uploaded successfully");
        }).catch((err) => {
            console.log(err, 'catch error');
        });
    }).catch((err) => {
        console.log(err, 'catch error');
    })
}

module.exports = new Media();