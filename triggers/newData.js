var express    = require('express');
var router = express.Router();
//const neighborhoodFilter = require('../data/dataSets.json');
const functions = require('../functions');
const data = require('../data/dataSets.json');


for (var i = 0; i < data.data.length; i++){
    // for each dataset in the dataSets.json 
    dataset = data.data[i];
    // create json file if one does not already exist 
    filename = './data/' + dataset['value'].substring(dataset['value'].length-14);
    searchField = dataset['date'];
    functions.createFile( filename, searchField);
}

router.get('/', function(req, res, next) {
    const models = data.models;
    res.status(200).json({ models });
});

router.post('/', function(req, res, next) {
    console.log("trigger fields --- ", req.body.triggerFields);
    if (req.body.triggerFields == undefined || req.body.triggerFields.data_set == undefined || req.body.triggerFields.neighborhood == undefined){
        const errors = [{"message": "newData trigger field is undefined"}];
        res.status(400).json({ errors });  
    };

    var limit = (req.body.limit !== undefined && req.body.limit !== null && req.body.limit !== '') ? req.body.limit : 50; // IF limit is present, just send that much
    var filename = './data/' + req.body.triggerFields.data_set.substring(req.body.triggerFields.data_set.length-14);
        
    console.log
    var index = data["data"].findIndex(x => x.value == req.body.triggerFields.data_set);
    console.log("This is the index of the data field we are looking for : " + index);
    var searchField = data["data"][index]["date"];
    console.log("This is the searchfield which will query and format the data : " + searchField);    
    var tablePath = 'data/' + req.body.triggerFields.data_set.substring(req.body.triggerFields.data_set.length-14);
    var table = functions.returnJson(tablePath);
    
    console.log(JSON.stringify(table));

    table = functions.formatData(table, searchField);
    var myData = [];
    for(var i=0; i< Math.min(limit, 5); i++) {
        console.log(table[i]);
        var myObj = table[i];
        myData.push(myObj);
    }
    // reverse to send data ordered by timestamp descending
    res.status(200).json({ "data" : myData.reverse() });
});

module.exports = router;

//https://data.cincinnati-oh.gov/resource/4cmv-h8ke.json?$query=SELECT%20neighborhood,viccount,type,dateoccurred%20WHERE%20(dateoccurred%20between%20%272018-05-06T00:00:00.000%27%20and%20%272018-06-25T00:00:00.000%27)%20GROUP%20BY%20=%27neighborhood%27

