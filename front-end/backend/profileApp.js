const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://smoop:c30MNpjC4hCu1Gj0@clustername-uocwt.mongodb.net";
const client = new MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true});
const apiKey = 'RGAPI-da6b967f-2ef7-4e9f-958d-1b8304e63ea7';

const express = require('express');
const app = express();
app.use(express.json());

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods','GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

var gameIdArray = [];
var champIdArray = [];
var running = false;


function getAccountId(nameRequest, res){
    
    var request = require("request");

    var option = {
      method: 'GET',
      url: 'https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/' + nameRequest,
      qs: {api_key: apiKey}
    };
    
    request(option, (error, response, body) => {
        if (error) throw new Error(error);
        var bodyJson = JSON.parse(body);
        
        if( bodyJson !== undefined){
            gameIdArray = [];
            champIdArray = [];
            getGameId(bodyJson.accountId, 0, 0, nameRequest, res);
        } else{
            console.log('Bad request at  : ' + option.url);
        }   
    });
}

function getGameId(accountId, begIndex, totalIndex, nameRequest, res){
    
    var request = require("request");
    
    var option = {
      method: 'GET',
      url: 'https://euw1.api.riotgames.com/lol/match/v4/matchlists/by-account/' + accountId + '?queue='+420+'&season=13&endIndex=' + (begIndex+100) + '&beginIndex=' + begIndex,
      qs: {api_key: apiKey}
    };
    
    request(option, (error, response, body) => {
        if (error) throw new Error(error);
        
        var bodyJson = JSON.parse(body);
        if(bodyJson.matches !== undefined){
            for(var i = 0; i < bodyJson.matches.length; i++){
                if(bodyJson.matches[i].timestamp >= 1578616224670) {
                    gameIdArray[totalIndex] = bodyJson.matches[i].gameId;
                    champIdArray[totalIndex] = bodyJson.matches[i].champion;
                    totalIndex++;
                }
            }
            console.log(totalIndex);
            if(totalIndex === begIndex+100){
                setTimeout( () => {
                    getGameId(accountId, totalIndex, totalIndex, nameRequest, res); 
                }, 500);
            } else {
                console.log("Votre profil prendra " + (totalIndex*1.2)/60 + " minutes à être analysé.");
                setTimeout( () => {
                    gameIdArray.forEach( (elem, index) => {
                        setTimeout( () => {
                            console.log(elem + ' : ' + champIdArray[index] + '                game : '  + index + '/' + totalIndex + ' state : ' + running);
                            analyseGame(elem, champIdArray[index], nameRequest);
                            
                            if( index+1 === totalIndex) {
                                setTimeout( () => {
                                    console.log('Calculate final data');
                                    running = false;
                                    sendStats(nameRequest, res);
                                }, 1500);
                            }
                        }, index * 1200);
                    });
                }, (begIndex+200)*12);
            }
        }
        else {
            console.log('Bad request at  : ' + option.url);
        }
    });
}

function analyseGame(gameId, championKey, nameRequest){ 
    
    const request = require('request');
    
    var options = {
        method: 'GET',
        url: 'https://euw1.api.riotgames.com/lol/match/v4/matches/'+gameId,
        qs: {api_key: apiKey}
        
    };
    
    var fs=require('fs');
    var dataJson=JSON.parse(fs.readFileSync('keys.json'));
    
    var championName = "";
    for(var k=0; k<147; k++){
        if(championKey === dataJson[k].KEY){
            championName = dataJson[k].Champion;
            break;
        }
    }
    
    request(options, (err, response, body) => {
        if (err) {
            console.log('Sorry unable to execute request. Error:', err);
        } 
        else {
            var bodyJson = JSON.parse(body);
            
            if( bodyJson.gameDuration !== undefined) {
            
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
                            break;
                        }
                    }
                    
                    var win = [0 ,0];

                    if(bodyJson.participants[index].stats.win === true){
                        win[0] = 1;
                    }
                    else{
                        win[1] = 1;    
                    }

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
                    }

                    var playerData = {
                        "nameChamp":championName,
                        "idChampion":championKey,
                        "win":  win[0],
                        "loose": win[1],
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
                    pushStats(playerData, nameRequest);
                } 
                else {
                    console.log('REMAKE');
                }
            }
            else {
                console.log('Bad request at  : ' + options.url);
            } 
        }
    });
}

function pushStats(playerData, nameRequest){
    
    const collection = client.db("USER_PROFILE").collection(nameRequest); 
    
    collection.findOne( {"nameChamp": playerData.nameChamp }, (err, doc) => {
        if (err) {
            throw err;
        }
        if(doc === null){
            collection.insertOne(playerData, (error, res) => {
                if(err){
                    throw err;
                } 
                console.log(playerData.nameChamp + ' -> push successful 1');
            });    
        } 
        else {
            collection.findOneAndUpdate(
                {"nameChamp":playerData.nameChamp},
                {$inc:
                    {   "gamePlayed" : 1,
                        "win": playerData.win,
                        "loose": playerData.loose,
                        "gameDuration":playerData.gameDuration,
                        "assists":playerData.assists,
                        "kill":playerData.kill,
                        "death":playerData.death,
                        "killParticipation":playerData.killParticipation,
                        "totalDamageDealt":playerData.totalDamageDealt,
                        "visionScore":playerData.visionScore,
                        "goldEarned":playerData.goldEarned,
                        "totalMinionKilled":playerData.totalMinionKilled,
                        "visionWardsBoughtInGame":playerData.visionWardsBoughtInGame,
                        "totalTimeCrowdControlDealt":playerData.totalTimeCrowdControlDealt,
                        "mid":playerData.mid,
                        "jungle":playerData.jungle,
                        "top":playerData.top,
                        "support":playerData.support,
                        "adc":playerData.adc
                      }
               }); 
            console.log(nameRequest + ' : ' + playerData.nameChamp + ' -> update successful 2');
        }
    });  
}


function sendStats(nameRequest, res){
    
    const collection = client.db("USER_PROFILE").collection(nameRequest); 
    
    
    //Check Doublon in USER_PROFILE
    collection.find().toArray( (err, docs) => {
       if (err) {
           throw err;
        } 

        var double = 0;

        docs.forEach( (elem,index, array) => {
            //setTimeout( function() {
            array.forEach( (el, ind, arr) => {

                if(elem.nameChamp === el.nameChamp && index < ind){
                    double++;

                    console.log(double + ' -> Elem : ' + elem.nameChamp + ' & El : ' + el.nameChamp + ' ----- index 1 : ' + index + ' & index 2 : ' + ind);
                    try {
                        collection.findOneAndUpdate(
                            {"nameChamp": elem.nameChamp,
                             "totalDamageDealt": elem.totalDamageDealt},
                            {$inc:
                                {   "gamePlayed" : el.gamePlayed,
                                    "win": el.win,
                                    "loose": el.loose,
                                    "gameDuration":el.gameDuration,
                                    "assists":el.assists,
                                    "kill":el.kill,
                                    "death":el.death,
                                    "killParticipation":el.killParticipation,
                                    "totalDamageDealt":el.totalDamageDealt,
                                    "visionScore":el.visionScore,
                                    "goldEarned":el.goldEarned,
                                    "totalMinionKilled":el.totalMinionKilled,
                                    "visionWardsBoughtInGame":el.visionWardsBoughtInGame,
                                    "totalTimeCrowdControlDealt":el.totalTimeCrowdControlDealt,
                                    "mid":el.mid,
                                    "jungle":el.jungle,
                                    "top":el.top,
                                    "support":el.support,
                                    "adc":el.adc
                                  }
                            },
                            {new : true},
                            (error, documents) => {
                                if(error) {
                                    throw error;
                                }
                                
                                //CHECK OUTPUT BEFORE DELETING
                                collection.deleteOne( {"nameChamp": el.nameChamp, "totalDamageDealt": el.totalDamageDealt} );
                            }
                        ); 
                    } catch (e) {
                       console.log(e);
                    }
                }
            });
            //}, index * 10);               
        });
    });
    
    collection.find().sort( { "gamePlayed": -1 } ).toArray( (err, result) => {
        if (err) {
            throw err;
        }             
        var response = [];
        
        result.forEach( (el, ind) => {
            
            el.win = +((el.win/el.gamePlayed)*100).toFixed(2);
            el.loose = +((el.loose/el.gamePlayed)*100).toFixed(2);
            el.killParticipation = +(el.killParticipation/el.gamePlayed).toFixed(2);
            el.gameDuration = +(el.gameDuration/el.gamePlayed).toFixed(2);
            el.assists = +(el.assists/el.gamePlayed).toFixed(2);
            el.kill = +(el.kill/el.gamePlayed).toFixed(2);
            el.death = +(el.death/el.gamePlayed).toFixed(2);
            el.totalDamageDealt = +(el.totalDamageDealt/el.gamePlayed).toFixed(2);
            el.visionWardsBoughtInGame = +(el.visionWardsBoughtInGame/el.gamePlayed).toFixed(2);
            el.visionScore = +(el.visionScore/el.gamePlayed).toFixed(2);
            el.goldEarned = +(el.goldEarned/el.gamePlayed).toFixed(2);
            el.totalTimeCrowdControlDealt = +(el.totalTimeCrowdControlDealt/el.gamePlayed).toFixed(2);
            el.totalMinionKilled = +(el.totalMinionKilled/el.gamePlayed).toFixed(2);
            
            el.KDA = ((el.kill+el.assists)/el.death).toFixed(2);
            
            response.push(el);
        });
        
        res.send(response);
    });
}

//Listening on port 8080
app.listen(8080, () => {
    console.log("started at http://localhost:8080/");
});

//Connect to Db
client.connect(err => {
    if (err) {
        console.log('Sorry unable to connect to MongoDB Error:', err);
    } else {
        console.log('Connected successfully to server', uri);
        
        
        app.get('/profile/:user', (req, res) => {     
            var name = req.params.user;

            console.log(name);

            const collection = client.db("USER_PROFILE").collection(name); 
            
            if (running === false) {   
                running = true;

                collection.find().toArray( (err, docs) => {
                    if (err) {
                       throw err;
                    }

                    if(docs.length !== undefined && docs.length > 0) {
                        console.log('Already in Db');
                        sendStats(name, res);
                    } 
                    else {
                        getAccountId(name, res);
                    }     
                }); 
            }
            else {
                collection.find().toArray( (err, docs) => {
                    if (err) {
                       throw err;
                    }

                    if(docs.length !== undefined && docs.length > 0) {
                        console.log('Already in Db');
                        sendStats(name, res);
                    } 
                    else {
                        console.log('Wait for first request to finish');
                    }     
                }); 
                console.log('Already running');
            }
        });
    }
});  