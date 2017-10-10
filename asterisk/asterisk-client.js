var client = require('ari-client');
var models = require('../models/index');
let path = require('path');
var Batch = models.Batch;
var Contact = models.Contact;
var CallDetail = models.CallDetail;
var asteriskApp = 'voice-server';
var settings = require('../config/asterisk-config');

var ariInstance;
var channelId;
client.connect(settings.ASTERISK_ARI_URL, settings.ASTERISK_ARI_USERNAME, settings.ASTERISK_ARI_PASSWORD)
    .then(function (ari) {
        ariInstance = ari;
        ariInstance.start(asteriskApp);
        console.log("Created connection successfully")
    })
    .catch(function (err) {
        console.log(err);
        throw err;
    });


client.createChannel = function (contact, batchMedia) {
    //console.log(ariInstance);
    //endpoint = 'PJSIP/6001'
    var endpoint = "PJSIP/" + contact.phoneNumber;
    var mediaFile = path.basename(batchMedia.filename, '.gsm');
    var media = 'sound:' + mediaFile;
    console.log(mediaFile);
    if (contact.status !== "COMPLETE") {
        ariInstance.channels.create({ endpoint: endpoint, app: asteriskApp, appArgs: 'dialed' })
            .then(function (channel) {
                CallDetail.create({
                    contactId: contact.id
                }).then((callDetail) => {
                    console.log("Created channel");
                    console.log(channel.id);
                    channel.on('StasisStart', function (event, channel) {
                        console.log("Stasis Start");
                    });
                    channel.on('StasisEnd', function (event, channel) {
                        console.log("Stasis End");
                        callDetail.timeEnded = new Date();
                        callDetail.save();
                        contact.status = "COMPLETE";
                        contact.save();
                    });
                    channel.on('ChannelDtmfReceived', function (event, channel) {
                        console.log("Dtmf received");
                        console.log(event);
                        if (callDetail.dtmf == null || callDetail.dtmf == undefined) {
                            callDetail.dtmf = event.digit;
                        } else {
                            callDetail.dtmf = callDetail.dtmf + "," + event.digit;
                        }

                        callDetail.save();
                    });
                    channel.on('ChannelStateChange', function (event, channel) {
                        console.log("Channel state changed");
                        if (event.channel.state === 'Up') {
                            callDetail.timeStarted = new Date();
                            callDetail.save();
                            console.log("Channel is up");
                            ariInstance.channels.play({
                                channelId: event.channel.id,
                                media: media
                            }).then(function (playback) {
                                playback.on('PlaybackFinished', function (event, playback) {
                                    console.log("Playback finished");
                                })
                                console.log("Played");
                            }).catch(function (err) {
                                console.log("Error playing");
                                console.log(err);
                            });



                        } else {
                            console.log("channel state changed to");
                            console.log(event.channel.state);
                        }
                        //console.log(event);
                    });

                    channelId = channel.id;

                    ariInstance.channels.dial({
                        channelId: channel.id
                    }).then(function () {
                        console.log("Dialed");
                    }).catch(function (err) {
                        console.log(err);
                    });

                }).catch(function (err) {
                    console.log("Error creating call detail");
                    console.log(err);
                });

            }).catch(function (err) {
                console.log(err);
                contact.status = "FAILED";
                contact.save();
            });
    }

}


module.exports = client;