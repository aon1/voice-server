var express = require('express');
var router = express.Router();
var path = require('path');
var multer = require('multer')
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname))
    }
})

var upload = multer({ storage: storage });

var models = require('../models/index');
var media = require('../asterisk/media');
var BatchMedia = models.BatchMedia;

router.post('', upload.single('file'), function (request, res, next) {
    console.log(request.file);
    var batchMedia = BatchMedia.build(request.body);
    batchMedia.filename = request.file.filename;
    media.upload(request.file.filename);
    console.log(request.file.path);
    batchMedia.save()
        .then((created, err) => {
            if (err) {
                console.log(err);
                res.status(500).json(err)
            } else {
                res.status(200).json(created)
            }
        }).catch(function (err) {
            console.log(err);
            res.status(500).json(err)
        });




});

router.get('', function (request, res, next) {

    BatchMedia.findAll()
        .then((batchMediaes, err) => {
            if (err) {
                res.status(500).json(err)
            } else {
                res.status(200).json(batchMediaes)
            }
        })
        .catch(function (err) {
            console.log(err);
            res.status(500).json(err)
        })

})

module.exports = router;