var client = require('ari-client');
var ariInstance;
var channelId;
client.connect('http://192.168.56.2:8088', 'asterisk', 'password')
    .then(function (ari) {
        ariInstance = ari;
        ariInstance.start('hello-world');
        console.log("Created connection successfully")
    })
    .catch(function (err) {
        console.log(err);
    });


client.createChannel = function () {
    //console.log(ariInstance);
    ariInstance.channels.create({ endpoint: 'PJSIP/6001', app: 'hello-world', appArgs: 'dialed' })
        .then(function (channel) {
            console.log("Created channel");
            console.log(channel.id);
            channel.on('StasisStart', function (event, channel) {
                console.log("Stasis Start");
            });
            channel.on('ChannelDtmfReceived', function (event, channel) {
                console.log("Dtmf received");
                //console.log(event);
            });
            channel.on('ChannelStateChange', function (event, channel) {
                console.log("Channel state changed");
                console.log(event);
                if (event.channel.state === 'Up') {
                    console.log("Channel is up");
                    ariInstance.channels.play({
                        channelId: event.channel.id,
                        media: 'sound:tt-monkeys'
                    })
                        .then(function (playback) {
                            playback.on('PlaybackFinished', function (event, playback) {
                                console.log("Playback finished");
                            })
                            console.log("Played");
                        })
                        .catch(function (err) {
                            console.log("Error playing");
                            console.log(err);
                        });
                }
                //console.log(event);
            });

            channelId = channel.id;

            ariInstance.channels.dial({
                channelId: channel.id
            })
                .then(function () {
                    console.log("Dialed");
                })
                .catch(function (err) {
                    console.log(err);
                });
        })
        .catch(function (err) {
            console.log(err);
        });
}
console.log(client);


module.exports = client;