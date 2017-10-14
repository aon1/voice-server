let logger = require('../config/logger');
let express = require('express');
let router = express.Router();
let bodyParser = require('body-parser');

let path = require('path');
let multer = require('multer')
let media = require('../asterisk/media');
let models = require('../models/index');
let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname))
    }
})

let upload = multer({ storage: storage });



let Survey = models.Survey;
let Question = models.Question;



router.post('', bodyParser.json(), function (request, res) {
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
    });
});

router.post('/:id/question', upload.single('file'), function (request, res) {
    var surveyId = request.params.id;
    Survey.findOne({ id: surveyId }).then(
        survey => {
            if (survey == null) {
                res.status(404)
            } else {
                let question = Question.build(request.body);
                question.mediaFile = request.file.filename;
                media.upload(request.file.filename);
                question.save().then((created, err) => {
                    if (err) {
                        res.status(400).json(err);
                    } else {
                        res.status(201).json(created)
                    }
                }).catch(function (err) {
                    res.status(500);
                    logger.error(err);
                })
            }
        }
    )

})

module.exports = router;
