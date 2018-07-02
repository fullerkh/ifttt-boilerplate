
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

function querySocrata(site, neighborhood, date){
	date.setDate(date.getDate()-1);
	date = date.toISOString().substring(0,9) + "T00:00:00.000";
	fields = "neighborhood,viccount,type,dateoccurred";
	
	neighborhood = neighborhood.replace(" ", "%27")
	console.log(neighborhood)

	console.log(date)
	
	//date = "2011-07-12" + "T00:00:00.000"
	
	if (neighborhood != "all"){
		query = "$query=select%20neighborhood,viccount,type,dateoccurred%20where%20dateoccurred%20=%20%27" + date + "%27and%20neighborhood%20=%20%22"+ neighborhood+ "%22"
	}else{
		query = "$query=select%20neighborhood,viccount,type,dateoccurred%20where%20dateoccurred%20=%20%27" + date + "%27";
	}
	url = site+query;
	console.log(url);
	//url_test = "https://data.cincinnati-oh.gov/resource/4cmv-h8ke.json?$query=select%20neighborhood,viccount,type,dateoccurred%20where%20dateoccurred%20=%20%272011-07-12T00:00:00.000%27"
	var json_obj = JSON.parse(httpGet(url));
	if (json_obj == undefined) console.log("undefined json object")
	else  console.log(json_obj);
	return json_obj
	
//https://data.cincinnati-oh.gov/resource/4cmv-h8ke.json?$where=dateoccurred%20between%20%272018-05-06T00:00:00.000%27%20and%20%272018-06-25T00:00:00.000%27
}

function httpGet(theUrl)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
    xmlHttp.send( null );
    return xmlHttp.responseText;
}


// sample final product
// https://data.cincinnati-oh.gov/resource/4cmv-h8ke.json?$query=select%20neighborhood,viccount,type,dateoccurred%20where%20dateoccurred%20=%20%272011-07-12T00:00:00.000%27and%20neighborhood%20=%20%27WEST%20END%27


site = "https://data.cincinnati-oh.gov/resource/4cmv-h8ke.json?";
neighborhood = "all";
date = new Date()


/* 
function dataEmailformating(data){
}

function dataAggragate(data){
}	 
//also send raw data??
*/

querySocrata(site, neighborhood, date);

//ideal = "Yestday there was 1 shooting in Walnut Hills. There was 1 fatal victim. for more information please visit the Cincinnati Shootings Insight at: https://ift.tt/2x6xh6r"