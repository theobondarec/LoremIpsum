const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://smoop:c30MNpjC4hCu1Gj0@clustername-uocwt.mongodb.net";
const client = new MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true});
const api_key = 'RGAPI-e1610c01-66ae-4269-bcbc-f76767e1a8b0';

const express = require('express');
const app = express();
app.use(express.json());

const leagueArray = ["IRON", "BRONZE", "SILVER", "GOLD", "PLATINUM", "DIAMOND", "MASTER", "GRANDMASTER", "CHALLENGER"]

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods','GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
})

var playerStats ={
"accountId":0,
"ligue":0,
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


function recuperationAccountId(playerName, championName, apiKey, res){
    var request = require("request");

    var option = {
      method: 'GET',
      url: 'https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/'+playerName,
      qs: {api_key: apiKey}
    };
    request(option, function (error, response, body) {
        if (error) throw new Error(error);        
        var bodyJson = JSON.parse(body);
        //console.log(recupElo(bodyJson.id, apiKey));
        recupElo(bodyJson.id, bodyJson.accountId, championName, apiKey, res);
    });
}

function recupElo(summonerId, accountId, championName, apiKey, res){
    var request = require("request");

    var optionLigue = {
        method: 'GET',
        url: 'https://euw1.api.riotgames.com/lol/league/v4/entries/by-summoner/'+summonerId,
        qs: {api_key: apiKey}
    };
    request(optionLigue, function (error, response, body) {
        if (error) throw new Error(error);        
        var bodyJsonLigue = JSON.parse(body);
        if(bodyJsonLigue.length == 0){
           var ligue = "UNRANKED";
            console.log("vous etes actuellement "+ligue);
           }
        else{
        for(var i = 0; i <bodyJsonLigue.length; i++){
            if(bodyJsonLigue[i].queueType === "RANKED_SOLO_5x5"){
                var ligue = bodyJsonLigue[i].tier;
                //console.log(ligue);
            }   
        }}
        //console.log(ligue);
        recuperationInfoChamp(accountId, championName, ligue, apiKey, res);
    });
//return ligue;
}

var histoSize = 0;
var remake = 0;
function recuperationInfoChamp(accountId, championName, ligue, apiKey, res){
    var fs=require('fs');
    var dataJson=JSON.parse(fs.readFileSync('keys.json'));
    console.log("recuperation champName : "+championName);

    //console.log(ligue);
    //res.send(accountId);


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
      url: 'https://euw1.api.riotgames.com/lol/match/v4/matchlists/by-account/'+accountId+'?champion='+championKey+'&queue='+420+'&endIndex=15',
      qs: {api_key: apiKey}
    };
    request(option, function (error, response, body) {
        if (error) throw new Error(error);        
        var bodyJson = JSON.parse(body);
        if(bodyJson.matches == null){
            var messageErreur = "vous n'avez jamais joué "+championName;
            console.log(messageErreur);
           }
        else{
            remake = 0;
            for(var i = 0; i < bodyJson.matches.length; i++){
                //console.log(bodyJson.matches[i].gameId);
                analyseStats(bodyJson.matches[i].gameId, accountId, championName, championKey, apiKey, bodyJson.matches.length, ligue, res);
        }
        }
    });
}

function analyseStats(gameId, accountId, championName ,championKey, apiKey, histoSize, ligue, res){
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
        }
        else{
            var bodyJson = JSON.parse(body);
            if(bodyJson.gameDuration < 300){console.log("BAD_REQUEST");remake+=1;}
            //console.log('Request successfull');
            //console.log("game N° : "+gameId);

            else if (bodyJson.gameDuration > 300){
                //Calcul Kill participation//
                //realHisto +=1;
                //console.log(realHisto);
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
                    if(bodyJson.gameDuration < 300){ ban = 1;}
                    else{ban = 0}
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
                        "ligue":ligue,
                        "accountId":accountId,
                        "idChampion":bodyJson.participants[index].championId,
                        "nomChampion":championName,
                        "loose": win[1],
                        "win":  win[0],
                        "ban": 0,
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
                    averageStats(playerData, histoSize, res);
            }
        }
    });
}

function averageStats(playerData, histoSize, res){
    playerStats.accountId = playerData.accountId;
    playerStats.ligue = playerData.ligue;
    playerStats.idChampion = playerData.idChampion;
    playerStats.nomChampion = playerData.nomChampion;
    playerStats.loose+=playerData.loose;
    playerStats.win+=playerData.win;
    playerStats.ban +=playerData.ban;
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
    
    console.log(histoSize-remake);
    if(playerStats.gamePlayed == histoSize-remake){ 
        pushToDb(playerStats, playerData.nomChampion, histoSize-remake, res);
    }
    //res.send(playerData.adc);
}

function pushToDb(playerStats, nameChamp, histoSize, res){
    const collection = client.db("USER_REQUEST").collection(nameChamp);

        playerStats.accountId =         playerStats.accountId;
        playerStats.ligue =             playerStats.ligue;
        playerStats.idChampion =        playerStats.idChampion;
        playerStats.nomChampion =       playerStats.nomChampion;
        playerStats.loose=             (playerStats.loose)/histoSize*100;
        playerStats.win=               (playerStats.win)/histoSize*100;
        playerStats.ban=               playerStats.ban;
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
        
        advices(playerStats, res);
}

function advices(playerStats, res){
    const collection = client.db("CHAMPIONS").collection(playerStats.ligue);
    collection.findOne( {"idChampion": playerStats.idChampion }, (err, doc) => {
        if (err) {
            throw err;
        }
        else{
            if(playerStats.visionScore >= doc.visionScore/doc.gamePlayed && playerStats.killParticipation >= doc.killParticipation/doc.gamePlayed && playerStats.totalDamageDealt >= doc.totalDamageDealt/doc.gamePlayed && playerStats.totalMinionKilled >= doc.totalMinionKilled/doc.gamePlayed){
               var okPassage = "Tu as de meilleurs stats que les personnes de ton niveau, tu devrais passer à la ligue superieur, ce n'est qu'une question de temps. Continue comme ca !!"
               //console.log(okPassage);
            }
            else{
                var phraseDbt = 'Afin de progresser, voici quelques conseils :';
                //console.log(phraseDbt);
                var winRate = playerStats.win/(playerStats.loose+playerStats.win)*100;

                if(doc.mid > doc.jungle && doc.mid >doc.top && doc.mid >doc.support && doc.mid >doc.adc){
                   var conseilPosition = playerStats.nomChampion + " se joue "+ playerStats.mid+"% du temps Mid";
                    //console.log(conseilPosition);
                }
                else if(doc.top > doc.jungle && doc.top >doc.mid && doc.top >doc.support && doc.top >doc.adc){
                    var conseilPosition = playerStats.nomChampion + " se joue "+ playerStats.top+"% du temps Top";
                    //console.log(conseilPosition);
                }
                else if(doc.jungle > doc.mid && doc.jungle >doc.top && doc.jungle >doc.support && doc.jungle >doc.adc){
                    var conseilPosition = playerStats.nomChampion + " se joue "+ playerStats.jungle+"% du temps Jungle";
                    //console.log(conseilPosition);
                }
                else if(doc.adc > doc.jungle && doc.adc >doc.top && doc.adc >doc.support && doc.adc >doc.mid){
                    var conseilPosition = playerStats.nomChampion + " se joue "+ playerStats.adc+"% du temps Adc";
                    //console.log(conseilPosition);
                }
                else if(doc.support > doc.jungle && doc.support >doc.top && doc.support >doc.mid && doc.support >doc.adc){
                    var conseilPosition = playerStats.nomChampion + " se joue "+ playerStats.support+"% du temps Support";
                    //console.log(conseilPosition);
                }
                if(winRate < 50){
                    var conseilBuild = " - ton winrate est de "+winRate+"%, cela veut dire que tu as un impact potentiellement négatif pour ton équipe dans la partie, il peut y avoir beaucoup de raisons liés à ça. Pense notamment à regarder les matchups à ton avantage avant de choisir ton champion.";
                    //console.log(conseilBuild);

                }
                if(playerStats.totalMinionKilled < (doc.totalMinionKilled)/doc.gamePlayed){
                    var differenceCreeps = ((doc.totalMinionKilled)/doc.gamePlayed) - playerStats.totalMinionKilled;
                    var conseilFarm = " - Pense à ameliorer ton farming. Tu as "+differenceCreeps+" creeps/par game de moins que les joueurs de ton niveau.";
                   //console.log(conseilFarm); 
                }
                else{
                    var conseilFarm = " - Tu as un meilleur farming que les joueurs de ce niveau.";
                    //console.log(conseilFarm);
                }
                if(playerStats.visionScore < (doc.visionScore)/doc.gamePlayed){
                    var differenceVision = ((doc.visionScore)/doc.gamePlayed)-playerStats.visionScore;
                    var conseilVision = " - Il faudrait penser à poser plus de ward. Tu en as posé " +playerStats.visionScore+ " soit "+ differenceVision +" de moins que les joueurs de "+ playerStats.nomChampion+" à ton elo.";
                    //console.log(conseilVision);
                }
                else{
                    var conseilVision = " - Ton warding est bon mais n'oublies pas que la vision est primordiale et ne doit jamais être délaissée."
                    //console.log(conseilVision);
                }
                if(playerStats.death > (doc.death)/doc.gamePlayed && playerStats.visionScore < (doc.visionScore)/doc.gamePlayed){
                    var conseilTiming = " - Attention au timming gank et à ton positionnement! Tu meurs "+(playerStats.death/((doc.death)/doc.gamePlayed))+" fois plus que tes adversaires."+" Penses à avoir la vision nécessaire avant d'engager une action risquée, cela t'aidera à prendre une meilleure décision."; 
                    //console.log(conseilTiming);
                }
                if(playerStats.jungle > playerStats.mid && playerStats.jungle >playerStats.top && playerStats.jungle >playerStats.support && playerStats.jungle >playerStats.adc && playerStats.killParticipation < (doc.killParticipation)/doc.gamePlayed){
                    var conseilJungle = " - Quand tu es Jungle, pense à regarder la position et l'aggressivité des lanes afin de leur apporter ton aide. Il faut généralement prioriser les ganks au farm de la jungle.";
                    //console.log(conseilJungle);
                }
                if(playerStats.killParticipation < (doc.killParticipation)/doc.gamePlayed){
                    var conseilImplication = " - N'oublies pas que c'est un jeu d'équipe avant tout et tu dois jouer avec celle-ci pour gagner!";
                    //console.log(conseilImplication);
                }
                if((doc.totalDamageDealt)/doc.gamePlayed > playerStats.totalDamageDealt){
                   var diffDamage = ((doc.totalDamageDealt)/doc.gamePlayed) - playerStats.totalDamageDealt;
                   var conseilMoreAggro= " - Essaie de jouer plus aggressif tu fais "+diffDamage+" de moins de degats par game que tes adversaires sur le champion!";
                   //console.log(conseilMoreAggro);
                }
                if(((doc.totalDamageDealt)/doc.gamePlayed) < playerStats.totalDamageDealt && playerStats.death > doc.death/doc.gamePlayed){
                   var diffDamage = playerStats.totalDamageDealt-(doc.totalDamageDealt)/doc.gamePlayed;
                   var adviceLessAggro= " - Essaie de jouer moins aggressif tu fais "+diffDamage+" de plus de degats par game que les joueurs de ce champion mais tu meurs trop souvent. Ne sois pas trop aggressif.";
                   //console.log(adviceLessAggro);
                }
            }
        }

        var ConseilStats = {
            playerStatsLigue:playerStats.ligue,
            playerStatsIdChampion:playerStats.idChampion,
            playerStatsNomChampion:playerStats.nomChampion,
            playerStatsLoose:playerStats.loose,
            playerStatsWin:playerStats.win,
            playerStatsBan:playerStats.ban,
            playerStatsGameDuration:playerStats.gameDuration,
            playerStatsAssists:playerStats.assists,
            playerStatsKill:playerStats.kill,
            playerStatsDeath:playerStats.death,
            playerStatsKillParticipation:playerStats.killParticipation,
            playerStatsTotalDamageDealt:playerStats.totalDamageDealt,
            playerStatsVisionScore:playerStats.visionScore,
            playerStatsGoldEarned:playerStats.goldEarned,
            playerStatsTotalMinionKilled:playerStats.totalMinionKilled,
            playerStatsVisionWardsBoughtInGame:playerStats.visionWardsBoughtInGame,
            playerStatsTotalTimeCrowdControlDealt:playerStats.totalTimeCrowdControlDealt,
            playerStatsMid:playerStats.mid,
            playerStatsTop:playerStats.top,
            playerStatsJungle:playerStats.jungle,
            playerStatsSupport:playerStats.support,
            playerStatsAdc:playerStats.adc,
            playerStatsGamePlayed:playerStats.gamePlayed,

            ligueStatsLigue: playerStats.ligue,
            ligueStatsIdChampion: doc.idChampion,
            ligueStatsNomChampion: doc.nomChampion,
            ligueStatsLoose:(doc.loose)/doc.gamePlayed*100,
            ligueStatsWin:(doc.win)/doc.gamePlayed*100,
            ligueStatsBan:(doc.ban)/doc.gamePlayed*100,
            ligueStatsGameDuration:(doc.gameDuration)/doc.gamePlayed,
            ligueStatsAssists:(doc.assists)/doc.gamePlayed,
            ligueStatsKill:(doc.kill)/doc.gamePlayed,
            ligueStatsDeath:(doc.death)/doc.gamePlayed,
            ligueStatsKillParticipation:(doc.killParticipation)/doc.gamePlayed,
            ligueStatsTotalDamageDealt:(doc.totalDamageDealt)/doc.gamePlayed,
            ligueStatsVisionScore:(doc.visionScore)/doc.gamePlayed,
            ligueStatsGoldEarned:(doc.goldEarned)/doc.gamePlayed,
            ligueStatsTotalMinionKilled:(doc.totalMinionKilled)/doc.gamePlayed,
            ligueStatsVisionWardsBoughtInGame:(doc.visionWardsBoughtInGame)/doc.gamePlayed,
            ligueStatsTotalTimeCrowdControlDealt:(doc.totalTimeCrowdControlDealt)/doc.gamePlayed,
            ligueStatsMid:(doc.mid)/doc.gamePlayed*100,
            ligueStatsTop:(doc.top)/doc.gamePlayed*100,
            ligueStatsJungle:(doc.jungle)/doc.gamePlayed*100,
            ligueStatsSupport:(doc.support)/doc.gamePlayed*100,
            ligueStatsAdc:(doc.adc)/doc.gamePlayed*100,
            ligueStats:doc.gamePlayed,


            //si joueur pas concerné par conseil alors conseil pas send
            conseilOkPassage: okPassage,
            conseilPhraseDbt: phraseDbt,
            conseilPoste: conseilPosition,
            conseilMatchUp: conseilBuild,
            conseilFarming: conseilFarm,
            conseilScoreVision: conseilVision,
            conseilTime: conseilTiming,
            conseilJgl:conseilJungle,
            conseilImpli:conseilImplication,
            conseilMoreAgro:conseilMoreAggro,
            conseilLessAgro: adviceLessAggro  
        }
        
        var notes = {
            "Farm" : 0,
            "Vision" : 0,
            "Damage" : 0,
            "Golds" : 0,
            "killParticipation" : 0
        }
        ///////////////////////////////////////
        //note(playerStats, notes, doc.nomChampion, res);
        const collection = client.db("CHAMPIONS").collection("CHALLENGER");
        collection.findOne({"nomChampion": doc.nomChampion }, (err, StatsChall) => {
            if (err) {
                throw err;
            }
            StatsChall.killParticipation = (StatsChall.killParticipation/StatsChall.gamePlayed).toFixed(2); //en%
            StatsChall.totalDamageDealt = (StatsChall.totalDamageDealt/StatsChall.gamePlayed).toFixed(2);
            StatsChall.visionScore = (StatsChall.visionScore/StatsChall.gamePlayed).toFixed(2);
            StatsChall.goldEarned = (StatsChall.goldEarned/StatsChall.gamePlayed).toFixed(2);           
            StatsChall.totalMinionKilled = (StatsChall.totalMinionKilled/StatsChall.gamePlayed).toFixed(2);


            //var maxFarm = StatsChall.totalMinionKilled;
            // FARM
            if (playerStats.totalMinionKilled >= StatsChall.totalMinionKilled){
                notes.Farm = 10;
            }
            else{
                notes.Farm = (playerStats.totalMinionKilled/StatsChall.totalMinionKilled)*10;
            }
            // VISION
            if (playerStats.visionScore >= StatsChall.visionScore){
                notes.Vision = 10;
            }
            else{
                notes.Vision = (playerStats.visionScore/StatsChall.visionScore)*10;
            }
            //DEGATS
            if (playerStats.totalDamageDealt >= StatsChall.totalDamageDealt){
                notes.Damage = 10;
            }
            else{
                notes.Damage = (playerStats.totalDamageDealt/StatsChall.totalDamageDealt)*10;
            }
            //GOLDS
            if (playerStats.goldEarned >= StatsChall.goldEarned){
                notes.Golds = 10;
            }
            else{
                notes.Golds = (playerStats.goldEarned/StatsChall.goldEarned)*10;
            }
            // killParticipation
            if (playerStats.killParticipation >= StatsChall.killParticipation){
                notes.killParticipation = 10;
            }
            else{
                notes.killParticipation = (playerStats.killParticipation/StatsChall.killParticipation)*10;
            }
            //console.log(notes);
            var DataSending = {
                statsTab:ConseilStats,
                notesTab:notes
            }
            res.send(DataSending);
        });
    });

}





function getStat(api_key){
    app.get('/Conseil/:invocateurName/:champion',(req,res)=> {
        var nameRequest = req.params.invocateurName;
        var champRequest = req.params.champion;
        console.log(nameRequest + champRequest);
        
        recuperationAccountId(nameRequest, champRequest, api_key, res);        
    });
}

app.listen(8080, () => {
    console.log("started at http://localhost:8080/");
});

client.connect(err => {
    if (err) {
        console.log('Sorry unable to connect to MongoDB Error:', err);
    } else {
        console.log('Connected successfully to server', uri);
            //recuperationAccountId(nameRequest, champRequest, api_key);
            getStat(api_key);
            //console.log('Done');
    }
});


/*const api_key = 'RGAPI-549d1513-76fb-4985-8a2e-8653c59fb93c';
var nameRequest = 'tchoupie59';
var champRequest = 'xerath';*/
//recuperationAccountId(nameRequest, champRequest, api_key);