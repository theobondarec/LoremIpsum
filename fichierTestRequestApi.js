function accountIdFromApi(pseudo, apiKey, callback){
    var request = require("request");

    var option = {
      method: 'GET',
      url: 'https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/'+pseudo,
      qs: {api_key: apiKey}
    };


    request(option, function (error, response, body) {
        if (error) throw new Error(error);        
        //OK
        var bodyJson = JSON.parse(body);
        console.log(bodyJson);
        //console.log(bodyJson.accountId);        
        //callback(null, bodyJson.accountId);
        
    });
    //console.log(bodyJson.accountId);
    //return bodyJson;
}

function historiqueFromApi(accountId, typeGame,indexMax, apiKey, callback){////recuperation historique
    var request = require("request");

    var option = {
      method: 'GET',
      url: 'https://euw1.api.riotgames.com/lol/match/v4/matchlists/by-account/'+ accountId+ '?queue='+typeGame+'&endIndex='+indexMax,
      qs: {api_key: apiKey}
    };


    request(option, function (error, response, body) {
        if (error) throw new Error(error);        
        //OK
        var bodyJson = JSON.parse(body);
        console.log(bodyJson);
        //console.log(bodyJson.accountId);        
        //callback(null, bodyJson.accountId);
        
    });
    //console.log(bodyJson.accountId);
    //return bodyJson;
}

function apiRequestRanked(ligue, rank, pageNumb, apiKey){///summonerId
    const game = 'RANKED_SOLO_5x5';
    //console.log(ligue + rank+pageNumb+apiKey);
    
    var request = require("request");
    var option = {
      method: 'GET',
      url: 'https://euw1.api.riotgames.com/lol/league-exp/v4/entries/'+game+'/'+ligue+'/'+rank+'?page='+pageNumb,
      qs: {api_key: apiKey}
    };

    request(option, function (error, response, body) {
        if (error) throw new Error(error);        
        //OK
        var bodyJson = JSON.parse(body);
        //console.log(body);
        for(var i =0; i< bodyJson.length;i++){
            console.log(i + " " + bodyJson[i].summonerId);          
        }

        //console.log(bodyJson[0]);
        
    });
    //bddPush();
}

const apiKey = 'RGAPI-7716bbe8-4a9b-4308-b5b5-15de08b5cf5e';
var pseudo = 'tchoupie59';
var accountId = 'tTWOFZ1AJbeeUuNLyLNdlBCQ5T3eOZb_h59NZojEBhMU-UU';
var typeGame = '420';
var indexMax = '20';
var ligue = 'IRON';
var rank = 'I';
var pageNumb = '1';
//accountIdFromApi(pseudo, apiKey);
//historiqueFromApi(accountId, typeGame, indexMax, apiKey);
apiRequestRanked(ligue, rank, pageNumb, apiKey)