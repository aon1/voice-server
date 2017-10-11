var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
let logger = require('../config/logger');
router.use(bodyParser.json());
var models = require('../models/index');

var User = models.User;

router.post('', function (request, res) {
    var user = User.build(request.body);
    user.save()
        .then((created, err) => {
            if (err) {
                res.status(500).json(err)
            } else {
                res.status(200).json(created)
            }
        }).catch(function (err) {
            logger.error(err);
            res.status(500).json(err)
        });

});

router.get('', function (request, res) {

    User.findAll().then((users, err) => {
        if (err) {
            res.status(500).json(err)
        } else {
            res.status(200).json(users)
        }
    }).catch(function (err) {
        logger.error(err);
        res.status(500).json(err)
    })

})

module.exports = router;