var express    = require('express');
var router = express.Router();
const data = require('../../data/dailyDataSets.json');

router.get('/', function(req, res, next) {
    res.status(200).json({ data });
});

router.post('/', function(req, res, next) {
    res.status(200).json(data);
});

module.exports = router;