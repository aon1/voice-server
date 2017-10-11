let Event = require('./event');
let logger = require('../config/logger');

function InitialState(client, channel, mediaFile, stateMachine) {
    this.state_name = "initial";

    this.enter = function () {
        var playback = client.Playback();
        channel.on("ChannelHangupRequest", on_hangup);
        channel.on("ChannelDtmfReceived", on_dtmf);
        client.on("PlaybackFinished", on_playback_finished);
        channel.play({ media: 'sound:' + mediaFile }, playback);

        function cleanup() {
            channel.removeListener('ChannelHangupRequest', on_hangup);
            channel.removeListener('ChannelDtmfReceived', on_dtmf);
            client.removeListener('PlaybackFinished', on_playback_finished);
            if (playback) {
                playback.stop();
            }
        }

        function on_hangup(event, channel) {
            logger.error("Channel on hangup on channel", channel.id);
            cleanup();
            stateMachine.changeState(Event.HANGUP);
        }

        function on_playback_finished(event) {
            if (playback && playback.id === event.playback.id) {
                cleanup();
                stateMachine.changeState(Event.PLAYBACK_COMPLETE);
            }
        }

        function on_dtmf(event, channel) {
            switch (event.digit) {
                case '#':
                    logger.error("User on channel skipped initial state: ", channel.id);
                    cleanup();
                    stateMachine.changeState(Event.DTMF_OCTOTHORPE);
            }
        }
    }
}
module.exports = InitialState;