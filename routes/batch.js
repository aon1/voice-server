var express = require('express');
var router = express.Router();
var multer = require('multer')
var upload = multer({ dest: 'uploads/' })

var models = require('../models/index');
var Batch = models.Batch;
var Contact = models.Contact;
const csv = require('csvtojson');
var schedule = require('node-schedule');
var batchComponent = require('../components/batch_component')

function createContact(contacts, batch) {
    contacts.forEach(function (element) {
        var contact = Contact.build(element);
        contact.batchId = batch.id;
        contact.userId = batch.userId;
        contact.save()
            .then((created, err) => {
                if (err) {
                    res.status(500).json(err)
                }
            }).catch(function (err) {
                console.log(err)
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
            batch.noOfRecords = records.length;
            console.log('end')
            batch.save()
                .then((created, err) => {
                    createContact(records, created);
                    if (err) {
                        console.log(err);
                        res.status(500).json(err)
                    } else {
                        console.log(batchComponent);
                        var j = schedule.scheduleJob(batch.scheduledDate, function (batchInstance) {
                            console.log("Running job");
                            batchComponent.process(batchInstance);
                        }.bind(null, batch));
                        console.log(j);
                        res.status(200).json(created)
                    }
                }).catch(function (err) {
                    console.log(err);
                    res.status(500).json(err)
                });
        });



});

router.get('', function (request, res, next) {

    Batch.findAll()
        .then((batches, err) => {
            if (err) {
                res.status(500).json(err)
            } else {
                res.status(200).json(batches)
            }
        })
        .catch(function (err) {
            console.log(err);
            res.status(500).json(err)
        })

})

module.exports = router;