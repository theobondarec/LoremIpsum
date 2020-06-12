const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://smoop:c30MNpjC4hCu1Gj0@clustername-uocwt.mongodb.net";
const client = new MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true});
const api_key = 'RGAPI-13af1c23-4818-4685-ac86-6ea1205ec35b';


//DEFINI PAR L'utilisateur
var nameRequest = 'tchoupie59';
var champRequest = 'xerath';
//
var playerStats ={
    "accountId":0,
    "idChampion":0,
    "nomChampion":0,
    "loose": 0,
    "win": 0,
    "ban": 0,
    "gameDuration": 0,
    "assists": 0,
    "kill": 0,
    "death": 0,
    "killParticipation": 0,
    "totalDamageDealt": 0,
    "visionScore": 0,
    "goldEarned": 0,
    "totalMinionKilled": 0,
    "visionWardsBoughtInGame": 0,
    "totalTimeCrowdControlDealt": 0,
    "mid": 0,
    "top": 0,
    "jungle": 0,
    "support": 0,
    "adc": 0,
    "gamePlayed":0
}

function recuperationAccountId(playerName, championName, apiKey){
    var request = require("request");

    var option = {
      method: 'GET',
      url: 'https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/'+playerName,
      qs: {api_key: apiKey}
    };
    request(option, function (error, response, body) {
        if (error) throw new Error(error);        
        var bodyJson = JSON.parse(body);
        recuperationInfoChamp(bodyJson.accountId, championName, apiKey);
    });
}

function recuperationInfoChamp(accountId, championName, apiKey){
    var fs=require('fs');
    var dataJson=JSON.parse(fs.readFileSync('keys.json'));
    console.log("recuperation champName : "+championName);
    
    var champNameToLower = championName.toLowerCase();
    var correctChampionName = champNameToLower[0].toUpperCase();
    for(var i =1; i< championName.length; i++){
        correctChampionName += championName[i];
        //console.log(correctChampionName);
    }
    for(var k=0; k<147; k++){
        if(correctChampionName === dataJson[k].Champion){
            var championKey = dataJson[k].KEY;
            break;
        }
    }
    var request = require("request");
    var option = {
      method: 'GET',
      url: 'https://euw1.api.riotgames.com/lol/match/v4/matchlists/by-account/'+accountId+'?champion='+championKey+'&endIndex=15',
      qs: {api_key: apiKey}
    };
    request(option, function (error, response, body) {
        if (error) throw new Error(error);        
        var bodyJson = JSON.parse(body);
        for(var i = 0; i < bodyJson.matches.length; i++){
            //console.log(bodyJson.matches[i].gameId);
            analyseStats(bodyJson.matches[i].gameId, accountId, championName, championKey, apiKey, bodyJson.matches.length);
        }
        
    });
}

function analyseStats(gameId, accountId, championName ,championKey, apiKey, histoSize){    
    const request = require('request');
    var options = {
        method: 'GET',
        url: 'https://euw1.api.riotgames.com/lol/match/v4/matches/'+gameId,
        qs: {api_key: apiKey}
        
    };
    
    var fs=require('fs');
    var dataJson=JSON.parse(fs.readFileSync('keys.json'));
    
    request(options, (err, response, body) => {
        if (err) {
            console.log('Sorry unable to execute request. Error:', err);
        } else {
            //console.log('Request successfull');
            console.log("game N° : "+gameId);
            var bodyJson = JSON.parse(body);
            
            if (bodyJson.gameDuration > 300) {
                
                //Calcul Kill participation//
                var totalKillsTeam = [0, 0];

                for(var i=0; i<5;i++){
                    totalKillsTeam[0] += bodyJson.participants[i].stats.kills;  
                    totalKillsTeam[1] += bodyJson.participants[5+i].stats.kills;
                }
                //calcul stats/champions//
                var index=0;
                for(var i = 0; i<10; i++){
                    if(bodyJson.participants[i].championId === championKey){
                       index = i;
                       //console.log(index);
                       }
                }
                //console.log("valeur index: "+index);
                //for(var index =0; index < 10; index++){
                    var ban = 0;
                    var win = [0 ,0];

                    if(bodyJson.participants[index].stats.win === true){
                        win[0] = 1;
                    }
                    else{
                        win[1] = 1;    
                    }

                    //            kill+assists/nmbr kill team*100
                    var assistPerso = bodyJson.participants[index].stats.assists;
                    var killsPerso = bodyJson.participants[index].stats.kills;
                    var killParticipation = 0;

                    if(index < 5){
                        killParticipation = ((killsPerso+assistPerso)/totalKillsTeam[0])*100;
                        if(totalKillsTeam[0] === 0 || killParticipation === Infinity){killParticipation = 0}
                        else{killParticipation = ((killsPerso+assistPerso)/totalKillsTeam[0])*100;}
                    }
                    else{killParticipation = ((killsPerso+assistPerso)/totalKillsTeam[1])*100;
                        if(totalKillsTeam[1] === 0 || killParticipation === Infinity){killParticipation = 0}
                         else{killParticipation = ((killsPerso+assistPerso)/totalKillsTeam[1])*100;}
                        }

                    var role = [0, 0, 0, 0 ,0];
                    switch (bodyJson.participants[index].timeline.lane) {
                        case 'MIDDLE':
                            role[0] = 1;
                            break;
                        case 'TOP':
                            role[1] = 1;
                            break;
                        case 'JUNGLE':
                            role[2] = 1;
                            break;
                        case 'BOTTOM':
                            if(bodyJson.participants[index].timeline.role === "DUO_SUPPORT"){
                                role[3] = 1;
                                break;
                            }
                            role[4] = 1;
                            break;
                        //default:
                            //console.log('No role');     
                    }

                    var playerData = {
                        "accountId":accountId,
                        "idChampion":bodyJson.participants[index].championId,
                        "nomChampion":championName,
                        "loose": win[1],
                        "win":  win[0],
                        "ban": ban,
                        "gameDuration": bodyJson.gameDuration,
                        "assists": assistPerso,
                        "kill": killsPerso,
                        "death": bodyJson.participants[index].stats.deaths,
                        "killParticipation": killParticipation,
                        "totalDamageDealt": bodyJson.participants[index].stats.totalDamageDealt,
                        "visionScore": bodyJson.participants[index].stats.visionScore,
                        "goldEarned": bodyJson.participants[index].stats.goldEarned,
                        "totalMinionKilled": bodyJson.participants[index].stats.totalMinionsKilled,
                        "visionWardsBoughtInGame": bodyJson.participants[index].stats.visionWardsBoughtInGame,
                        "totalTimeCrowdControlDealt": bodyJson.participants[index].stats.totalTimeCrowdControlDealt,
                        "mid": role[0],
                        "top": role[1],
                        "jungle": role[2],
                        "support": role[3],
                        "adc": role[4],
                        "gamePlayed":1
                    }
                    //Check si on push bien les bonnes infos
                    //console.log(champData);
                    averageStats(playerData, histoSize);
                //}
            } else console.log('BAD REQUEST');
        }
    });
}


function averageStats(playerData, histoSize){
    playerStats.accountId = playerData.accountId;
    playerStats.idChampion = playerData.idChampion;
    playerStats.nomChampion = playerData.nomChampion;
    playerStats.loose+=playerData.loose;
    playerStats.win+=playerData.win;
    playerStats.ban+=playerData.ban;
    playerStats.gameDuration+=playerData.gameDuration;
    playerStats.assists+=playerData.assists;
    playerStats.kill+=playerData.kill;
    playerStats.death+=playerData.death;
    playerStats.killParticipation+=playerData.killParticipation;
    playerStats.totalDamageDealt+=playerData.totalDamageDealt;
    playerStats.visionScore+=playerData.visionScore;
    playerStats.goldEarned+=playerData.goldEarned;
    playerStats.totalMinionKilled+=playerData.totalMinionKilled;
    playerStats.visionWardsBoughtInGame+=playerData.visionWardsBoughtInGame;
    playerStats.totalTimeCrowdControlDealt+=playerData.totalTimeCrowdControlDealt;
    playerStats.mid+=playerData.mid;
    playerStats.top+=playerData.top;
    playerStats.jungle+=playerData.jungle;
    playerStats.support+=playerData.support;
    playerStats.adc+=playerData.adc;
    playerStats.gamePlayed+=playerData.gamePlayed;
    
    pushToDb(playerStats, playerData.nomChampion, histoSize);
}

function pushToDb(playerStats, nameChamp, histoSize){
    const collection = client.db("USER_REQUEST").collection(nameChamp);
    if(playerStats.gamePlayed == histoSize){
        
        playerStats.accountId =         playerStats.accountId;
        playerStats.idChampion =        playerStats.idChampion;
        playerStats.nomChampion =       playerStats.nomChampion;
        playerStats.loose=             (playerStats.loose)/histoSize*100;
        playerStats.win=               (playerStats.win)/histoSize*100;
        playerStats.ban=               (playerStats.ban)/histoSize*100;
        playerStats.gameDuration=      (playerStats.gameDuration)/histoSize;
        playerStats.assists=           (playerStats.assists)/histoSize;
        playerStats.kill=              (playerStats.kill)/histoSize;
        playerStats.death=             (playerStats.death)/histoSize;
        playerStats.killParticipation= (playerStats.killParticipation)/histoSize;
        playerStats.totalDamageDealt=  (playerStats.totalDamageDealt)/histoSize;
        playerStats.visionScore=       (playerStats.visionScore)/histoSize;
        playerStats.goldEarned=        (playerStats.goldEarned)/histoSize;
        playerStats.totalMinionKilled= (playerStats.totalMinionKilled)/histoSize;
        playerStats.visionWardsBoughtInGame=(playerStats.visionWardsBoughtInGame)/histoSize;
        playerStats.totalTimeCrowdControlDealt =(playerStats.totalTimeCrowdControlDealt)/histoSize;
        playerStats.mid=               (playerStats.mid)/histoSize*100;
        playerStats.top=               (playerStats.top)/histoSize*100;
        playerStats.jungle=            (playerStats.jungle)/histoSize*100;
        playerStats.support=           (playerStats.support)/histoSize*100;
        playerStats.adc=               (playerStats.adc)/histoSize*100;
        
        
        ///Calcul deja fait inutile de stocker
        console.log(playerStats);
        //On peut ne pas les stocker et les utiliser directement
        
        
        collection.findOne( {"idChampion": playerStats.accountId }, (err, doc) => {
            if (err) {
                throw err;
            }
            if(doc === null){
                collection.insertOne(playerStats, (error, res) => {
                    if(err){
                        throw err;
                    } 
                    console.log(playerStats.accountId + ' -> push successful');
                });

            } else if(doc !== null){
                collection.findOneAndUpdate(
                    {"accountId":playerStats.accountId},
                    {$inc:
                        { "gamePlayed" : playerStats.gamePlayed,
                            "loose": playerStats.loose,
                            "win": playerStats.win,
                            "ban":playerStats.ban,
                            "gameDuration":playerStats.gameDuration,
                            "assists":playerStats.assists,
                            "kill":playerStats.kill,
                            "death":playerStats.death,
                            "killParticipation":playerStats.killParticipation,
                            "totalDamageDealt":playerStats.totalDamageDealt,
                            "visionScore":playerStats.visionScore,
                            "goldEarned":playerStats.goldEarned,
                            "totalMinionKilled":playerStats.totalMinionKilled,
                            "visionWardsBoughtInGame":playerStats.visionWardsBoughtInGame,
                            "totalTimeCrowdControlDealt":playerStats.totalTimeCrowdControlDealt,
                            "mid":playerStats.mid,
                            "jungle":playerStats.jungle,
                            "top":playerStats.top,
                            "support":playerStats.support,
                            "adc":playerStats.adc
                          }
                });
                console.log(playerStats.accountId + ' -> update successful');
            }
        });
    }
}


client.connect(err => {
    if (err) {
        console.log('Sorry unable to connect to MongoDB Error:', err);
    } else {
        console.log('Connected successfully to server', uri);
            recuperationAccountId(nameRequest, champRequest, api_key);
            console.log('Done');
    }
});


/*const api_key = 'RGAPI-549d1513-76fb-4985-8a2e-8653c59fb93c';
var nameRequest = 'tchoupie59';
var champRequest = 'xerath';*/
//recuperationAccountId(nameRequest, champRequest, api_key);