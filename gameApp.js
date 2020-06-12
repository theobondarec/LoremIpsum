///////
//pour test j'ai mis les données d'un chamion a supprimer avant de lancer le final!
////////////////////A FAIRE LIGNE 196//////////////////
///////


const MongoClient = require('mongodb').MongoClient;

const uri = "mongodb+srv://smoop:c30MNpjC4hCu1Gj0@clustername-uocwt.mongodb.net";

const client = new MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true});

const leagueArray = ["IRON", "BRONZE", "SILVER", "GOLD", "PLATINUM", "DIAMOND", "MASTER", "GRANDMASTER", "CHALLENGER"];
//const leagueArray = ["IRON", "BRONZE"];

//const delay = [2420, 2420, 2420, 2420, 3220, 3220, 1025, 700, 300];
const delay = [0, 2450, 4900, 7350, 9800, 13050, 16300, 17350, 18100]; //////REFAIRE LE DELAY
//const delay = [0, 2450];
//const delay = [0, 24, 49, 73, 98, 130, 163, 173, 181];
// 0    1    2      3       4   5       6     7     8
// 24 -> 24 -> 24 -> 24 -> 32 -> 32 -> 10 -> 7 -> 3



function getGameId(n){
    const collection = client.db("GAME_ID").collection(leagueArray[n]); 
    
    collection.find().toArray( (err, docs) => {
        if(err){
            throw err;   
        }
        console.log('Array built successfuly');
        
        docs.forEach( (elem, index) => {
            setTimeout( function() {
                if(elem.accountId !== null){
                    console.log("ligue: "+leagueArray[n] + ' --> game n° ' + index + ' : ' + elem.gameId);
                    getGame(elem.gameId, n);
                } 
           }, index * 1200); 
        });
    });
}

function getGame(gameId, n) {
    const request = require('request');
    var options = {
        method: 'GET',
        url: 'https://euw1.api.riotgames.com/lol/match/v4/matches/'+gameId,
        qs: {api_key: 'RGAPI-c1926f56-38f8-477b-8f7e-19b62eb5b8a3'}
        
    };
    
    var fs=require('fs');
    var data=fs.readFileSync('keys.json');
    var dataJson=JSON.parse(data);
    
    request(options, (err, response, body) => {
        if (err) {
            console.log('Sorry unable to execute request. Error:', err);
        } else {
            console.log('Request successfull');
            var bodyJson = JSON.parse(body);
            
            //Calcul Kill participation//
            var totalKillsTeam1 = 0;
            var totalKillsTeam2 = 0;
            for(var i=0; i<10;i++){
                if(i < 5){
                   totalKillsTeam1 += bodyJson.participants[i].stats.kills;
                }
                else{
                    totalKillsTeam2 += bodyJson.participants[i].stats.kills;
                }
            }
            //calcul stats/champions//
            for(var index =0; index < 10; index++){
                ////PersoBan pdt la game////
                var ban = 0;
                for(var y = 0; y < 2; y++){
                    for(var i = 0; i<5; i++){  
                        if(bodyJson.teams[y].bans[i].championId === bodyJson.participants[index].championId){
                            console.log("ban: "+bodyJson.teams[y].bans[i].championId);
                            ban++;
                        }
                    }   
                }
                
                var gamePlayed = 0;
                
                var winThisGame = 0;
                var looseThisGame = 0;
                if(bodyJson.participants[index].stats.win === true){
                    //console.log("win: "+bodyJson.participants[index].stats.win);
                    winThisGame = 1;
                }
                else{
                    //console.log("win: "+bodyJson.participants[index].stats.win);
                    looseThisGame = 1;    
                }
                //            kill+assists/nmbr kill team*100
                var assistPerso = bodyJson.participants[index].stats.assists;
                var killsPerso = bodyJson.participants[index].stats.kills;
                var killParticipation = 0;
                
                if(index < 5){
                    killParticipation = ((killsPerso+assistPerso)/totalKillsTeam1)*100;
                }
                else{killParticipation = ((killsPerso+assistPerso)/totalKillsTeam2)*100;}
                //console.log("KP : "+killParticipation);
                
                var midRole =0;
                var topRole = 0;
                var jglRole = 0;
                var supportRole = 0;
                var adcRole = 0;
                var championId = bodyJson.participants[index].championId;
                var championName;

                if(bodyJson.participants[index].timeline.lane === "MIDDLE"){midRole = 1;}
                else if(bodyJson.participants[index].timeline.lane === "TOP"){topRole = 1;}
                else if(bodyJson.participants[index].timeline.lane === "JUNGLE"){jglRole = 1;}
                else if(bodyJson.participants[index].timeline.lane === "BOTTOM" && bodyJson.participants[index].timeline.role === "DUO_SUPPORT"){supportRole = 1;}
                else if(bodyJson.participants[index].timeline.lane === "BOTTOM" && bodyJson.participants[index].timeline.role === "DUO_CARRY"){adcRole = 1;}
        
                ///RECUPERATION DES NOMS CHAMPIONS
                for(var ii=0; ii<147; ii++){
                    if(championId === dataJson[ii].KEY){
                        console.log(dataJson[ii].Champion);
                        championName = dataJson[ii].Champion;
                    }
                }
                
                var champData = {
                    "idChampion":championId,
                    "nomChampion":championName,
                    "gamePlayed": 1,
                    "loose": looseThisGame,
                    "win":  winThisGame,
                    "ban": ban,
                    "gameDuration": bodyJson.gameDuration,
                    "assists": bodyJson.participants[index].stats.assists,
                    "kill":bodyJson.participants[index].stats.kills,
                    "death":bodyJson.participants[index].stats.deaths,
                    "killParticipation":killParticipation,
                    "totalDamageDealt":bodyJson.participants[index].stats.totalDamageDealt,
                    "visionScore":bodyJson.participants[index].stats.visionScore,
                    "goldEarned":bodyJson.participants[index].stats.goldEarned,
                    "totalMinionKilled":bodyJson.participants[index].stats.totalMinionsKilled,
                    "visionWardsBoughtInGame":bodyJson.participants[index].stats.visionWardsBoughtInGame,
                    "totalTimeCrowdControlDealt":bodyJson.participants[index].stats.totalTimeCrowdControlDealt,
                    "mid":midRole,
                    "jungle":jglRole,
                    "top":topRole,
                    "support":supportRole,
                    "adc":adcRole
                }
                //Check si on push bien les bonnes infos
                console.log(champData);
                pushGameInfo(champData, n, championId);
            }
        }
    });
}

function pushGameInfo(data, n, championId) {
    const collection = client.db("Champions").collection(leagueArray[n]);
    
    /////CA FONCTION BIEN SI LE CHAMP ID EXISTE ! pour test j'ai mis les données d'un chamion a supprimer avant de lancer le final!
    collection.findOneAndUpdate(
        { "idChampion": championId},
        {$inc: { "gamePlayed" : data.gamePlayed,
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
    
    ///Si le champion n'existe pas insertOne :                              //////////////////A FAIRE//////////////////
/*    else{
        collection.insertOne(data, (err, res) => {
            if(err){
                throw err;
            } 
            console.log(championId + ' -> push successful');
        });
    }*/
                        
                        
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

           }, delay[index] * 1200); 
        });
        
    }
});