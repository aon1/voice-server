'use strict';
var models = require('../models/index');
var PreambleState = require('../asterisk/preamble_state');
var Question = models.Question;


function SurveyComponent() {

}

SurveyComponent.prototype.process = function (client, channel, survey, callDetail, batch) {
    
    
    Question.findAll({
        where: { surveyId: survey.id },
    }).then((questions) => {
        let preambleState = new PreambleState(client, channel, questions, callDetail, survey, batch);
        preambleState.enter();
    })
}

module.exports = new SurveyComponent();