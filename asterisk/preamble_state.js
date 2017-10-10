var Event = require('./event');
let logger = require('../config/logger');
function PreambleState(client, channel, questions, stateMachine) {
    this.state_name = "preamble";
    this.enter = function () {
        let currentPlayback;
        let currentSound;
        let soundsToPlay = [];
        let playback;
        logger.debug("Entering preamble state");

        channel.on("ChannelHangupRequest", onHangup);
        client.on("PlaybackFinished", onPlaybackFinished);
        channel.on("ChannelDtmfReceived", onDtmf);
        initializePlaybacks();

        function initializePlaybacks() {
            currentPlayback = 0;
            questions.forEach(function (question) {
                soundsToPlay.push({
                    'playback': client.Playback(),
                    'media': 'sound:' + question.mediaFile
                })
            }, this);
            startPlayBack();
        }

        function startPlayBack() {
            currentSound = soundsToPlay[currentPlayback];
            playback = currentSound['playback'];
            channel.play({ media: currentSound['media'] }, playback);
        }

        function cleanup() {
            channel.removeListener('ChannelHangupRequest', onHangup);
            channel.removeListener('ChannelDtmfReceived', onDtmf);
            client.removeListener('PlaybackFinished', onPlaybackFinished);
            if (playback) {
                playback.stop();
            }
        }

        function onHangup(event, channel) {
            playback = null;
            cleanup();
            stateMachine.change_state(Event.HANGUP);
        }

        function onPlaybackFinished(event) {
            currentSound = soundsToPlay[currentPlayback];
            if (playback && (playback.id === event.playback.id)) {
                playback = null;
                currentPlayback++;
                if (currentPlayback === soundsToPlay.length) {
                    cleanup();
                    stateMachine.change_state(Event.PLAYBACK_COMPLETE);
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
                stateMachine.change_state(Event.PLAYBACK_COMPLETE);
            } else {
                startPlayBack();
            }
        }

        function onDtmf(event, channel) {
            switch (event.digit) {
                case '#':
                    cleanup();
                    stateMachine.change_state(Event.DTMF_OCTOTHORPE);
                    break;
                default:
                    skipToNextSound();
                    break;


            }
        }
    }
}



module.exports = PreambleState;