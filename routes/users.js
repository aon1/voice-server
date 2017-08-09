var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.json());
var models = require('../models/index');
var User = models.User;

router.post('', function (request, res, next) {
    var user = User.build(request.body);
    user.save()
        .then((created, err) => {
            if (err) {
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

    User.findAll()
        .then((users, err) => {
            if (err) {
                res.status(500).json(err)
            } else {
                res.status(200).json(users)
            }
        })
        .catch(function(err){
            console.log(err);
            res.status(500).json(err)
        })

})

module.exports = router;