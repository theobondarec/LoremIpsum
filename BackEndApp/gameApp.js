const MongoClient = require('mongodb').MongoClient;

const uri = "mongodb+srv://smoop:c30MNpjC4hCu1Gj0@clustername-uocwt.mongodb.net";

const client = new MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true});

//division des taches//
    //personne 1 uncom de la ligne 15 => 15,509H
//const leagueArray = ["IRON"];
    //personne 2 uncom de la ligne 17 => 13,247333333H
//const leagueArray = ["BRONZE"];
    //personne 3 uncom de la ligne 19 => 15,8966667H
//const leagueArray = ["SILVER"];
    //personne 4 uncom de la ligne 21 => 15,866H
//const leagueArray = ["GOLD"];
    //personne 5 uncom de la ligne 23 => 21,245666667H                    ////////DEJA EN COURS DE TRAITEMENT////////
//const leagueArray = ["PLATINUM"];
    //personne 6 uncom de la ligne 25 => 21,2133333H
//const leagueArray = ["DIAMOND"];
    //personne 6 uncom de la ligne 27 => 13,32666667H
//const leagueArray = ["MASTER", "GRANDMASTER", "CHALLENGER"];
//const delay = [0, ‬20310, 34120];

function getGameId(n){
    const collection = client.db("GAME_ID").collection(leagueArray[n]); 
    
    collection.find().toArray( (err, docs) => {
        if(err){
            throw err;   
        }
        console.log('Array built successfuly');
        
        
        //Si ca crash mettre le numero de la game ou ca a crash ici; 
        var repriseCrash = 0;
        docs.forEach( (elem, index, array) => {
            setTimeout( function() {
                if(array[index+repriseCrash].accountId !== null){
                    console.log("ligue: " + leagueArray[n] + ' --> game n° ' + index + ' : ' + array[index+repriseCrash].gameId);
                    getGame(array[index+repriseCrash].gameId, n);
                } 
           }, index * 1300); 
        });
    });
}

function getGame(gameId, n) {
    const request = require('request');
    var options = {
        method: 'GET',
        url: 'https://euw1.api.riotgames.com/lol/match/v4/matches/'+gameId,
        qs: {api_key: 'RGAPI-c3c5c59b-2ce1-44f7-886e-a8062a3ef664'}
        
    };
    
    var fs=require('fs');
    var dataJson=JSON.parse(fs.readFileSync('keys.json'));
    
    request(options, (err, response, body) => {
        if (err) {
            console.log('Sorry unable to execute request. Error:', err);
        } else {
            //console.log('Request successfull');
            var bodyJson = JSON.parse(body);
            
            if (bodyJson.gameDuration > 300) {
                
                //Calcul Kill participation//
                var totalKillsTeam = [0, 0];

                for(var i=0; i<5;i++){
                    totalKillsTeam[0] += bodyJson.participants[i].stats.kills;  
                    totalKillsTeam[1] += bodyJson.participants[5+i].stats.kills;
                }
                //calcul stats/champions//
                for(var index =0; index < 10; index++){
                    ////PersoBan pdt la game////
                    var ban = 0;
                    /*for(var y = 0; y < 2; y++){
                        for(var i = 0; i<5; i++){  
                            if(bodyJson.teams[y].bans[i].championId === bodyJson.participants[index].championId){
                                console.log("ban: "+bodyJson.teams[y].bans[i].championId);
                                ban++;
                            }
                        }   
                    }*/

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


                    ///RECUPERATION DES NOMS CHAMPIONS
                    for(var k=0; k<147; k++){
                        if(bodyJson.participants[index].championId === dataJson[k].KEY){
                            //console.log(dataJson[k].Champion);
                            var championName = dataJson[k].Champion;
                            break;
                        }
                    }

                    var champData = {
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
                    pushGameInfo(champData, n);
                }
            } else console.log('BAD REQUEST');
        }
    });
}

function pushGameInfo(data, n) {
    
    const collection = client.db("CHAMPIONS").collection(leagueArray[n]);
    
    collection.findOne( {"idChampion": data.idChampion }, (err, doc) => {
        if (err) {
            throw err;
        }
        if(doc === null){
            collection.insertOne(data, (error, res) => {
                if(err){
                    throw err;
                } 
                console.log(data.nomChampion + ' -> push successful');
            });
            
        } else {
            collection.findOneAndUpdate(
                { "idChampion": data.idChampion},
                {$inc: 
                    { "gamePlayed" : 1,
                        "loose": data.loose,
                        "win": data.win,
                        "ban":data.ban,
                        "gameDuration":data.gameDuration,
                        "assists":data.assists,
                        "kill":data.kill,
                        "death":data.death,
                        "killParticipation":data.killParticipation,
                        "totalDamageDealt":data.totalDamageDealt,
                        "visionScore":data.visionScore,
                        "goldEarned":data.goldEarned,
                        "totalMinionKilled":data.totalMinionKilled,
                        "visionWardsBoughtInGame":data.visionWardsBoughtInGame,
                        "totalTimeCrowdControlDealt":data.totalTimeCrowdControlDealt,
                        "mid":data.mid,
                        "jungle":data.jungle,
                        "top":data.top,
                        "support":data.support,
                        "adc":data.adc
                      }
               }); 
        }
    });                                 
}

client.connect(err => {
    if (err) {
        console.log('Sorry unable to connect to MongoDB Error:', err);
    } else {
        console.log('Connected successfully to server', uri);
        leagueArray.forEach( (elem, index) => {
            setTimeout( function() {
                getGameId(index);
                console.log('Done : ' + index);

           }, index * 1300); 
        });
        
    }
});