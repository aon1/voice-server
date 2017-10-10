'use strict';
var models = require('../models/index');
var Question = models.Question;


function SurveyComponent() {

}

SurveyComponent.prototype.process = function (client, channel, survey, callDetail) {
    Question.findAll({
        where: { surveyId: survey.id },
    }).then((questions) => {

    })
}

module.exports = new SurveyComponent();