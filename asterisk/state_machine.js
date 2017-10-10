function StateMachine() {
    var transitions = {};
    var currentState = null;

    this.addTransition = function (srcState, event, dstState) {
        if (!transitions.hasOwnProperty(srcState.stateName)) {
            transitions[srcState.stateName] = {};
        }
        transitions[srcState.stateName][event] = dstState;
    }

    this.changeState = function (event) {
        currentState = transitions[currentState.stateName][event];
        currentState.enter();
    }

    this.start = function (initialState) {
        currentState = initialState;
        currentState.enter();
    }
}

module.exports = StateMachine;