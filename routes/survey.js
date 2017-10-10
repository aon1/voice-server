let logger = require('../config/logger');
let express = require('express');
let router = express.Router();
let bodyParser = require('body-parser');
router.use(bodyParser.json());
let models = require('../models/index');

let Survey = models.Survey;


router.post('', function (request, res) {
    let survey = Survey.build(request.body);
    survey.save().then((created, err) => {
        if (err) {
            res.status(400).json(err);
        } else {
            res.status(201).json(created)
        }
    }).catch(function (err) {
        res.status(500);
        logger.error(err);
    })
})

router.get('', function (request, res) {
    Survey.findAll().then((surveys) => {
        res.status(200).json(surveys)
    }).catch(function (err) {
        res.status(500).json(err);
        logger.error(err);
    })
})

router.get(':id', function (request, res) {
    var surveyId = request.params.id;
    Survey.findOne(surveyId).then((survey) => {
        res.status(200).json(survey)
    }).catch(function (err) {
        res.status(500).json(err);
        logger.error(err);
    })
})