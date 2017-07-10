'use strict';

var client = require('ari-client');

var ENDPOINT = 'PJSIP/6001';

// replace ari.js with your Asterisk instance
client.connect('http://192.168.56.2:8088', 'asterisk', 'password')
    .then(function (ari) {

        var outgoing = ari.Channel();

        outgoing.on('ChannelDestroyed',
            /**
             *  If the endpoint rejects the call, hangup the incoming channel.
             *
             *  @callback outgoingChannelDestroyedCallback
             *  @memberof originate-example
             *  @param {Object} event - the full event object
             *  @param {module:resources~Channel} channel -
             *    the channel that was destroyed
             */
            function (event, channel) {
                console.log("ChannelDestroyed");
            });

        outgoing.on('StasisStart',
            /**
             *  When the outgoing channel enters Stasis, create a mixing bridge
             *  and join the channels together.
             *
             *  @callback outgoingStasisStartCallback
             *  @memberof originate-example
             *  @param {Object} event - the full event object
             *  @param {module:resources~Channel} outgoing -
             *    the outgoing channel entering Stasis
             */
            function (event, outgoing) {

                outgoing.on('StasisEnd',

                    function (event, channel) {

                        console.log("StasisEnd");
                    });

                outgoing.answer()
                    .then(function () {
                        var playback = ari.Playback();

                        // Play demo greeting and register dtmf event listeners
                        return outgoing.play(
                            { media: 'sound:hello-world' },
                            playback
                        );
                    })
                    .then(function (playback) {
                        registerDtmfListeners(playback, incoming);
                    })
                    .catch(function (err) { });
            });

        function registerDtmfListeners(playback, outgoing) {
            outgoing.on('ChannelDtmfReceived',
                /**
                 *  Handle DTMF events to control playback. 5 pauses the playback, 8
                 *  unpauses the playback, 4 moves the playback backwards, 6 moves the
                 *  playback forwards, 2 restarts the playback, and # stops the
                 *  playback and hangups the channel.
                 *
                 *  @callback channelDtmfReceivedCallback
                 *  @memberof playback-example
                 *  @param {Object} event - the full event object
                 *  @param {module:resources~Channel} channel - the channel on which
                 *    the dtmf event occured
                 */
                function (event, channel) {

                    var digit = event.digit;

                    switch (digit) {
                        case '5':
                            playback.control({ operation: 'pause' })
                                .catch(function (err) { });
                            break;
                        case '8':
                            playback.control({ operation: 'unpause' })
                                .catch(function (err) { });
                            break;
                        case '4':
                            playback.control({ operation: 'reverse' })
                                .catch(function (err) { });
                            break;
                        case '6':
                            playback.control({ operation: 'forward' })
                                .catch(function (err) { });
                            break;
                        case '2':
                            playback.control({ operation: 'restart' })
                                .catch(function (err) { });
                            break;
                        case '#':
                            playback.control({ operation: 'stop' })
                                .catch(function (err) { });
                            incoming.hangup()
                                .finally(function () {
                                    process.exit(0);
                                });
                            break;
                        default:
                            console.error(util.format('Unknown DTMF %s', digit));
                    }
                });
        }
        ari.start('hello-world');
        outgoing.originate({
            endpoint: ENDPOINT,
            app: 'hello-world',
            appArgs: 'dialed'
        })
            .then(function (channel) {
                channel.dial().then(function (state) {
                    console.log(state);
                });
                console.log(channel.state);
            })
            .catch(function (err) {
                console.log("There was an error");
            });

    })
    .done(); // program will crash if it fails to connect

module.exports = client;