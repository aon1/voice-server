//var Event = require('./event');
let logger = require('../config/logger');
let path = require('path');
function PreambleState(client, channel, questions, callDetail) {
    this.state_name = "preamble";
    this.enter = function () {
        let currentPlayback;
        let currentSound;
        let soundsToPlay = [];
        let playback;
        logger.debug("Entering preamble state");
        channel.on('StasisStart', function (event, channel) {
            logger.debug("Stasis started:")
        });
        channel.on('ChannelStateChange', function (event) {
            if (event.channel.state === 'Up') {
                logger.debug("Channel changed to up:")
                callDetail.timeStarted = new Date();
                callDetail.save();
                initializePlaybacks();
            } else {
                logger.debug("Channel changed to :", event.channel.state)
            }
        });
        channel.on('StasisEnd', function (event) {
            logger.debug("Stasis End on channel");
            callDetail.timeEnded = new Date();
            callDetail.save();
        });

        channel.on("ChannelHangupRequest", onHangup);
        channel.on("PlaybackFinished", onPlaybackFinished);
        channel.on("ChannelDtmfReceived", onDtmf);
        client.ariInstance.channels.dial({
            channelId: channel.id
        }).then(function () {
            logger.debug("Dialed the channel");
        }).catch(function (err) {
            logger.error(err);
        });


        function initializePlaybacks() {
            currentPlayback = 0;
            questions.forEach(function (question) {
                var mediaFile = path.basename(question.mediaFile, '.gsm');

                soundsToPlay.push({
                    'playback': client.ariInstance.Playback(),
                    'media': 'sound:' + mediaFile
                })
            }, this);
            startPlayBack();
        }

        function startPlayBack() {
            currentSound = soundsToPlay[currentPlayback];
            playback = currentSound['playback'];
            client.ariInstance.channels.play({ channelId: channel.id, media: currentSound['media'], playbackId: playback.id });
        }

        function cleanup() {
            channel.removeListener('ChannelHangupRequest', onHangup);
            channel.removeListener('ChannelDtmfReceived', onDtmf);
            channel.removeListener('PlaybackFinished', onPlaybackFinished);
            if (playback) {
                playback.stop();
            }
        }

        function onHangup(event, channel) {
            playback = null;
            callDetail.timeEnded = new Date();
            callDetail.save();
            cleanup();
            //stateMachine.change_state(Event.HANGUP);
        }

        function onPlaybackFinished(event) {
            currentSound = soundsToPlay[currentPlayback];
            if (playback && (playback.id === event.playback.id)) {
                playback = null;
                currentPlayback++;
                if (currentPlayback === soundsToPlay.length) {
                    cleanup();
                    //stateMachine.change_state(Event.PLAYBACK_COMPLETE);
                } else {
                    startPlayBack();
                }
            }
        }

        function skipToNextSound() {
            playback = null;
            currentPlayback++;
            if (currentPlayback === soundsToPlay.length) {
                cleanup();
                //stateMachine.change_state(Event.PLAYBACK_COMPLETE);
            } else {
                startPlayBack();
            }
        }

        function onDtmf(event, channel) {
            logger.debug("Received dtmf");
            switch (event.digit) {
                case '#':
                    cleanup();
                    //stateMachine.change_state(Event.DTMF_OCTOTHORPE);
                    break;
                default:
                    playback.stop();
                    skipToNextSound();
                    break;


            }
        }
    }
}



module.exports = PreambleState;