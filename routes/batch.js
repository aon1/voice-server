var express = require('express');
var router = express.Router();
var multer = require('multer')
var upload = multer({ dest: 'uploads/' })

var models = require('../models/index');
var Batch = models.Batch;
var Contact = models.Contact;
var BatchMedia = models.BatchMedia;
const csv = require('csvtojson');
var batchComponent = require('../components/batch_component');
let logger = require('../config/logger');

function createContact(contacts, batch) {
    contacts.forEach(function (element) {
        var contact = Contact.build(element);
        contact.batchId = batch.id;
        contact.userId = batch.userId;
        contact.save()
            .then((created, err) => {
                logger.error(err);
            }).catch(function (err) {
                logger.error(err)
            });
    });
}

router.post('', upload.single('file'), function (request, res, next) {

    var batch = Batch.build(request.body);
    var file = request.file;
    var records = [];
    csv()
        .fromFile(file.path)
        .on('json', (jsonObj) => {
            records.push(jsonObj);
        })
        .on('done', (error) => {
            logger.error(error);
            batch.noOfRecords = records.length;
            batch.save()
                .then((created, err) => {
                    createContact(records, created);
                    if (err) {
                        logger.error(err);
                        res.status(500).json(err)
                    } else {
                        res.status(200).json(created)
                    }
                }).catch(function (err) {
                    logger.error(err);
                    res.status(500).json(err)
                });
        });



});

router.get('', function (request, res) {

    Batch.findAll()
        .then((batches, err) => {
            if (err) {
                res.status(500).json(err)
            } else {
                res.status(200).json(batches)
            }
        })
        .catch(function (err) {
            logger.error(err);
            res.status(500).json(err)
        })

})

router.put('/initiate/:batchId', function (request, res) {
    var batchId = request.params.batchId;
    Batch.findOne({ where: { id: batchId } })
        .then(batch => {
            BatchMedia.findOne({ where: { batchId: batchId } }).then(batchMedia => {
                if (batch.status !== "PENDING") {
                    res.status(400).json(batch);
                } else {
                    batchComponent.process(batch, batchMedia);
                    batch.status = 'PROCESSING';
                    batch.save().then((created, err) => {
                        if (err) {
                            res.status(400).json(err);
                        } else {
                            res.status(200).json();
                        }

                    }).catch(function (err) {
                        logger.error(err);
                        res.status(500).json(err)
                    });
                }

            }).catch(function (err) {
                logger.error(err);
                res.status(500).json(err)
            });



        }).catch(function (err) {
            logger.error(err);
            res.status(500).json(err)
        })
})


module.exports = router;