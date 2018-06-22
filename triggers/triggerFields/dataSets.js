var express    = require('express');
var router = express.Router();
const data = require('../../dataSets.json');

router.get('/', function(req, res, next) {
    const datasets = data.options;
    res.status(200).json({ datasets });
});

router.post('/', function(req, res, next) {
    console.log("setup - body", req.body);
    // reverse to send data ordered by timestamp descending
    res.status(200).json(data);
});

module.exports = router;