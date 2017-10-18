//var Event = require('./event');
let logger = require('../config/logger');
let path = require('path');
let models = require('../models/index');
let Answer = models.Answer;

function PreambleState(client, channel, questions, callDetail, survey, batch) {
    this.state_name = "preamble";
    this.enter = function () {
        let currentPlayback;
        let currentSound;
        let soundsToPlay = [];
        let playback;
        let currentQuestion;
        let liveRecording;
        let bridge;


        logger.debug("Entering preamble state");
        channel.on('StasisStart', function (event, channel) {
            logger.debug("Stasis started:")
        });
        channel.on('ChannelStateChange', function (event) {
            if (event.channel.state === 'Up') {
                logger.debug("Channel changed to up:")
                callDetail.timeStarted = new Date();
                callDetail.save();
                client.ariInstance.bridges.create({ type: 'mixing' })
                    .then(function (bridgeInstance) {
                        bridge = bridgeInstance;
                        bridge.addChannel({ channel: channel.id })
                            .then(function () {
                                logger.debug("Added channel to bridge");
                                initializePlaybacks();
                            }).catch(function (err) {
                                logger.error(err);
                            });

                    })
                    .catch(function (err) {
                        logger.debug(err);
                    });


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
                var mediaFile = path.basename(question.mediaFile, '.wav');

                soundsToPlay.push({
                    'playback': client.ariInstance.Playback(),
                    'media': 'sound:' + mediaFile,
                    'question': question
                })
            }, this);
            startPlayBack();
        }

        function startPlayBack() {
            currentSound = soundsToPlay[currentPlayback];
            playback = currentSound['playback'];

            currentQuestion = currentSound['question'];
            logger.debug("Playing media", currentSound['media']);
            //client.ariInstance.channels.play({ channelId: channel.id, media: currentSound['media'], playbackId: playback.id });
            client.ariInstance.bridges.play({ bridgeId: bridge.id, media: currentSound['media'], playbackId: playback.id })
                .then(function () {

                })
                .catch(function (err) {
                    logger.error("Error with playing playback:", err);
                });
        }

        function cleanup() {
            if (liveRecording) {
                return;
            }
            channel.removeListener('ChannelHangupRequest', onHangup);
            channel.removeListener('ChannelDtmfReceived', onDtmf);
            channel.removeListener('PlaybackFinished', onPlaybackFinished);
            if (playback) {
                playback.stop()
                    .catch(function (err) {
                        logger.error("Error with cleanup playback:", err);
                    });
            }
            if (liveRecording) {
                liveRecording.stop()
                    .catch(function (err) {
                        logger.error("Error with cleanup recording:", err);
                    });
            }
            client.ariInstance.channels.hangup({
                channelId: channel.id
            })
                .then(function () {
                    logger.debug("Deleted channel");
                })
                .catch(function (err) {
                    logger.error(err);
                });
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
            logger.debug("Skipping next sound");
            if (currentPlayback === soundsToPlay.length) {
                cleanup();
                //stateMachine.change_state(Event.PLAYBACK_COMPLETE);
            } else {
                startPlayBack();
            }
        }

        function onDtmf(event, channel) {
            logger.debug("Received dtmf-->: ", event.digit);
            switch (event.digit) {
                case '#':
                    cleanup();
                    //stateMachine.change_state(Event.DTMF_OCTOTHORPE);
                    break;
                case '*':
                    record();
                    break;
                default:
                    playback.stop()
                        .then(function () {

                        })
                        .catch(function (err) {
                            logger.error("Error with stop playback:", err);
                        });
                    saveAnswer(event.digit);
                    skipToNextSound();
                    break;


            }
        }

        function onRecordingFinished(event, recording) {
            logger.debug("Recording finished");
            saveRecordingAnswer(recording);
            skipToNextSound();
        }

        function saveAnswer(dtmf) {
            let answer = new Answer();
            answer.dtmf = dtmf;
            answer.questionId = currentQuestion.id;
            answer.userId = survey.userId;
            answer.batchId = batch.id;
            answer.contactId = callDetail.contactId;
            answer.save();
        }

        function saveRecordingAnswer(liverecording) {
            let answer = new Answer();
            answer.mediaFile = liverecording.name;
            answer.questionId = currentQuestion.id;
            answer.userId = survey.userId;
            answer.batchId = batch.id;
            answer.contactId = callDetail.contactId;
            answer.save();
            liveRecording = null;
        }
        function record() {
            playback.stop()
                .catch(function (err) {
                    logger.error("Error with playback before record:", err);
                });
            let name = 'answer_' + Date.now() + '';
            client.ariInstance.bridges.record({
                bridgeId: bridge.id,
                format: 'wav',
                name: name,
                terminateOn: '#',
                beep: true 
            })
                .then(function (liverecording) {
                    liveRecording = liverecording;
                    liveRecording.on("RecordingFinished", onRecordingFinished);
                })
                .catch(function (err) {
                    logger.error(err);
                });

        }
    }
}



module.exports = PreambleState;