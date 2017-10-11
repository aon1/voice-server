let InitialState = require('../../asterisk/initial-state');

describe("initial state", function () {
    let initialState, client, channel, stateMachine = null;
    let mediaFile = "media";
    beforeEach(function(){
        client = jasmine.createSpyObj('Client', ['emit', 'on', 'run', 'Playback'])
        channel = jasmine.createSpyObj('Channel', ['emit', 'on', 'run', 'removeListener', 'play']);
        stateMachine = jasmine.createSpyObj('StateMachine', ['emit', 'on', 'run']);
        initialState = new InitialState(client, channel, mediaFile, stateMachine);
    });

    it("tracks that initial state functions as expected", function () {
        initialState.enter();

        expect(client.Playback).toHaveBeenCalledTimes(2);
    })
    
})