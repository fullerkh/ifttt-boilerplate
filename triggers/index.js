var express    = require('express');
var router = express.Router();

// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
    console.log('Trigger is called.');
    next();
});

// my-trigger
router.use('/my_trigger', require('./my-trigger'));

// newData
router.use('/newData', require('./newData'));
router.use('/newData/fields/data_set/options', require('./triggerFields/dataSets'));
router.use('/newData/fields/neighborhood/options', require('./triggerFields/neighborhoods'));

// pullData
router.use('/pullData', require('./pullData'));
router.use('/pullData/fields/data_set/options', require('./triggerFields/dailydataSets'));
router.use('/pullData/fields/neighborhood/options', require('./triggerFields/neighborhoods'));

module.exports = router;