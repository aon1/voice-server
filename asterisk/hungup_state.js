let logger = require('../config/logger');
function HungUpState(channel) {
    this.state_name = "hungup";
 
    this.enter = function() {
        logger.info("Channel with name hung up: ", channel.name);
    }
}
 
module.exports = HungUpState;