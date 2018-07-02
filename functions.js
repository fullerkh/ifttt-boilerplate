/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

const fs = require('fs');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

module.exports = {
    createFile: function(filename, searchfield) {
      fs.open(filename,'r',function(err, fd){
        if (err) {
             // time to write 
            json_obj = grabData(filename.substring(7), searchfield);
            // doesn't work
            //json_obj = module.functions.formatData(filename,searchfield);
            console.log(json_obj);
            //json_obj = module.exports.formatData(json_obj, searchfield);
            json_obj = JSON.stringify(json_obj) 
            //console.log(json_obj);  
            fs.writeFileSync(filename, json_obj, (err) => {
                if (err) throw err;
                console.log('The file has been saved!');
            });
        } else {
            console.log("The file exists!");
        }
      });
    },
    // function currently not in use. 
    querySocrata: function(filename, dateField){
        date = new Date();
        date.setDate(date.getDate()-1);
        //console.log(date);
        date = date.toISOString().substring(0,10) + "T00:00:00.000";


        url = "https://data.cincinnati-oh.gov/resource/" + filename.substring(7);
        query = "?$where=" + dateField + "=%20%27" + date + "%27&$order=" + dateField + "%20DESC";
        url = url + query;
        console.log(url);           
        var json_obj = JSON.parse(httpGet(url)); 
        console.log(json_obj);
        
        var currentDataJson = []
        var currentData = returnJson(filename);

        console.log("opening up : " + filename+ " ------- this is the current data " + currentData);
        if (currentData[0][dateField] != json_obj[0][dateField] && json_obj[0] != 'undefined'){
            json_obj = grabData(filename.substring(7), dateField);
            json_obj = module.exports.formatData(json_obj, dateField);
            fs.writeFileSync(filename, JSON.stringify(json_obj), (err) => { 
                if (err) throw err;
                console.log('The file has been saved!');
                return json_obj
            }); 
        }else return currentData;   
    },   
    httpGet: function(theUrl){
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
        xmlHttp.send( null );
        return xmlHttp.responseText;        
    },
    formatData: function(json_obj, searchfield){
        if (json_obj == null){
            console.log(" table with search field of " + searchfield + " is null and therefore cannot be formatted");
            return;
        }
        var fiveDays = [];
        index = 0;
        // once we have 5 entries there's no reason to keep on filling out the table. 
        while (fiveDays.length < 5){
            var oneday = {}; // this is be all the data for one day and all the formatted varibles for the trigger. 
            oneday["data"] = []; // this will be all the raw json data for a day. 
            //console.log(JSON.stringify(json_obj[0]));
            date = json_obj[index][searchfield].substring(0,10);
            donedate = json_obj[index][searchfield].substring(0,10);
            // grab all data in the same day. 
            // while the dates are the same 
            while (date == donedate){
                oneday["data"].push(json_obj[index]);
                index++;
                date = json_obj[index][searchfield].substring(0,10);
            }
            // make sure donedate and date equal each other again for next iteration
            donedate = json_obj[index][searchfield].substring(0,10);
            // format a whole days data here 
            body = "";
            subject = "";
            var timestamp = Math.round(Date.now() /1000); // To get seconds
            var meta = {
                "id" : fiveDays.length,
                "key" : fiveDays.length,
                "timestamp" : timestamp
            };
            oneday["meta"] = meta;
            oneday['email_body'] = body;
            oneday['email_subject'] = subject;
            var created_at = new Date();
            oneday['created_at'] = created_at.toISOString();
            // oneday["data"] is already assigned 

            // add a whole days data 
            fiveDays.push(oneday);
            console.log(oneday);
            }
        return fiveDays;
    },
    returnJson : function(path){
        fs.readFile(path, (err, data) => {
            if (err) throw err;
            data = JSON.stringify(JSON.parse(data));
            console.log(" in the returnJSON function data is " + data);
            return data;
        });
    }
}


function httpGet(theUrl){
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
    xmlHttp.send( null );
    return xmlHttp.responseText;        
}

// grab data from socrata function. Just to be used for grabbing data for the first time. 
function grabData(filename, searchfield){
    datefrom = new Date();
    datefrom.setDate(datefrom.getDate()-21);
    datefrom = datefrom.toISOString().substring(0,10) + "T00:00:00.000";
    dateto = new Date();
    dateto.setDate(dateto.getDate()-1); 
    dateto = dateto.toISOString().substring(0,10) + "T00:00:00.000";

    url = "https://data.cincinnati-oh.gov/resource/" + filename;
    query = "?$where=" + searchfield + "%20between%20%27" + datefrom + "%27%20and%20%27" + dateto + "%27&$order=" + searchfield + "%20DESC";
    url = url + query;
    console.log(url);           
    var json_obj = JSON.parse(httpGet(url)); 
    for (var i = 0; i< json_obj.length; i++){
        if(json_obj[i].searchfield=='undefined'){
            delete json_obj[i]; 
            console.log("json record with undefined search field");
        }
    }
    return json_obj;
    
}

//https://data.cincinnati-oh.gov/resource/p2sk-mhnu.json?$where=approved_by_city_council%20between%20%272017-06-05T00:00:00.000%27%20and%20%272018-06-25T00:00:00.000%27

/* old part of socrataquery
        json_obj = formatData(json_obj, searchfield);
 
        url = site+query;
        console.log(url);
        var json_obj = JSON.parse(httpGet(url));
        if (json_obj == undefined){
            console.log("undefined json object: no records to add")
        }else{  
            console.log(json_obj);
            query = 
            url = site+query;
            var json_obj = JSON.parse(httpGet(url));
        }
        return json_obj*/