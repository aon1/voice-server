var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.json());
var models = require('../models/index');
var CallDetail = models.CallDetail;


router.get('/batch/:batchId', function (request, res, next) {
    var batchId = request.params.batchId;
    CallDetail.findByBatch(batchId)
        .then((contacts, err) => {
            if (err) {
                res.status(500).json(err)
            } else {
                res.status(200).json(contacts)
            }
        })
        .catch(function(err){
            console.log(err);
            res.status(500).json(err)
        })

})

module.exports = router;