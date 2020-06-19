require('dotenv/config');

const MongoClient = require('mongodb').MongoClient;
const uri = process.env.mongoDBConnection;
const client = new MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true});
const apiKey = process.env.riotApi_key;

const express = require('express');
const app = express();
app.use(express.json());

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', process.env.allowedOrigin);
    res.header('Access-Control-Allow-Methods',process.env.allowedMethods);
    res.header('Access-Control-Allow-Headers', process.env.allowedHeaders);
    next();
});

var playerStats = {};
var remake = 0;

///analysePlayer///
function recuperationAccountId(playerName, championName, res) {
    var request = require("request");

    var option = {
        method: 'GET',
        url: 'https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/'+playerName,
        qs: {api_key: apiKey}
    };
    
    request(option, (error, response, body) => {
        if (error) throw new Error(error);
        var bodyJson = JSON.parse(body);
        
        if( bodyJson !== undefined){
            recupElo(bodyJson.id, bodyJson.accountId, championName, res);
        } else{
            console.log('Bad request at  : ' + option.url);
        }
        
    });
}

function recupElo(summonerId, accountId, championName, res) {
    var request = require("request");

    var optionLigue = {
        method: 'GET',
        url: 'https://euw1.api.riotgames.com/lol/league/v4/entries/by-summoner/'+summonerId,
        qs: {api_key: apiKey}
    };
    
    request(optionLigue, (error, response, body) => {
        if (error) throw new Error(error);
                
        var bodyJsonLigue = JSON.parse(body);
        if( bodyJsonLigue !== undefined){
            var ligue = "UNRANKED";
            for(var i = 0; i < bodyJsonLigue.length; i++){
                if(bodyJsonLigue[i].queueType === "RANKED_SOLO_5x5"){
                    ligue = bodyJsonLigue[i].tier;
                    break;
                }   
            }
            recuperationInfoChamp(accountId, championName, ligue, res);           
        } else {
            console.log('Bad request at  : ' + optionLigue.url);
        }

    });
}

function recuperationInfoChamp(accountId, championName, ligue, res){
    var fs=require('fs');
    var dataJson=JSON.parse(fs.readFileSync('keys.json'));
    console.log("recuperation champName : " + championName);

    var champNameToLower = championName.toLowerCase();
    var correctChampionName = champNameToLower[0].toUpperCase();
    for(var i =1; i< championName.length; i++){
        correctChampionName += championName[i];
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
    request(option, (error, response, body) => {
        if (error) throw new Error(error);
        
        var bodyJson = JSON.parse(body);
        if(bodyJson.matches === undefined){
            var messageErreur = "vous n'avez jamais joué " + championName;
            console.log(messageErreur);
        }
        else{
            remake = 0;
            for(var i = 0; i < bodyJson.matches.length; i++){
                analyseStats(bodyJson.matches[i].gameId, accountId, championName, championKey, bodyJson.matches.length, ligue, res);   
            }
        }
    });
}

function analyseStats(gameId, accountId, championName ,championKey, histoSize, ligue, res){
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
            
            if(bodyJson.gameDuration !== undefined){
                if (bodyJson.gameDuration > 300){
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

                    playerStats.accountId = accountId;
                    playerStats.ligue = ligue;
                    playerStats.idChampion = bodyJson.participants[index].championId;
                    playerStats.nomChampion = championName;
                    playerStats.win += win[0];
                    playerStats.loose += win[1];
                    playerStats.gameDuration += bodyJson.gameDuration;
                    playerStats.assists += assistPerso;
                    playerStats.kill += killsPerso;
                    playerStats.death += bodyJson.participants[index].stats.deaths;
                    playerStats.killParticipation += killParticipation;
                    playerStats.totalDamageDealt += bodyJson.participants[index].stats.totalDamageDealt;
                    playerStats.visionScore += bodyJson.participants[index].stats.visionScore;
                    playerStats.goldEarned += bodyJson.participants[index].stats.goldEarned;
                    playerStats.totalMinionKilled += bodyJson.participants[index].stats.totalMinionsKilled;
                    playerStats.visionWardsBoughtInGame += bodyJson.participants[index].stats.visionWardsBoughtInGame;
                    playerStats.totalTimeCrowdControlDealt += bodyJson.participants[index].stats.totalTimeCrowdControlDealt;
                    playerStats.mid += role[0];
                    playerStats.top += role[1];
                    playerStats.jungle += role[2];
                    playerStats.support += role[3];
                    playerStats.adc += role[4];
                    playerStats.gamePlayed++;

                } 
                else {
                    console.log("REMAKE");
                    remake++;
                }
            } else {
                console.log('Bad request at  : ' + options.url);
                remake++;
            }

            if (remake == 5){ ////////////////////pas > 5 ????
                console.log('Too many request');
                res.send("Too many request");
            }
            else if (playerStats.gamePlayed === histoSize-remake && remake < 5) {
                var div = histoSize-remake;
                playerStats.accountId =         playerStats.accountId;
                playerStats.ligue =             playerStats.ligue;
                playerStats.idChampion =        playerStats.idChampion;
                playerStats.nomChampion =       playerStats.nomChampion;
                playerStats.loose=              +((playerStats.loose)/div*100).toFixed(2);
                playerStats.win=                +((playerStats.win)/div*100).toFixed(2);
                playerStats.ban=                playerStats.ban;
                playerStats.gameDuration=       +((playerStats.gameDuration)/div).toFixed(2);
                playerStats.assists=            +((playerStats.assists)/div).toFixed(2);
                playerStats.kill=               +((playerStats.kill)/div).toFixed(2);
                playerStats.death=              +((playerStats.death)/div).toFixed(2);
                playerStats.killParticipation=  +((playerStats.killParticipation)/div).toFixed(2);
                playerStats.totalDamageDealt=   +((playerStats.totalDamageDealt)/div).toFixed(2);
                playerStats.visionScore=        +((playerStats.visionScore)/div).toFixed(2);
                playerStats.goldEarned=         +((playerStats.goldEarned)/div).toFixed(2);
                playerStats.totalMinionKilled=  +((playerStats.totalMinionKilled)/div).toFixed(2);
                playerStats.visionWardsBoughtInGame= +((playerStats.visionWardsBoughtInGame)/div).toFixed(2);
                playerStats.totalTimeCrowdControlDealt = +((playerStats.totalTimeCrowdControlDealt)/div).toFixed(2);
                playerStats.mid=                +((playerStats.mid)/div*100).toFixed(2);
                playerStats.top=                +((playerStats.top)/div*100).toFixed(2);
                playerStats.jungle=             +((playerStats.jungle)/div*100).toFixed(2);
                playerStats.support=            +((playerStats.support)/div*100).toFixed(2);
                playerStats.adc=                +((playerStats.adc)/div*100).toFixed(2);

                advices(playerStats, res);
            }
        }
    });
}

function advices(playerStats, res){
    console.log('Preparing advices');
    const collection = client.db("CHAMPIONS").collection(playerStats.ligue);
    collection.findOne( {"idChampion": playerStats.idChampion }, (err, doc) => {
        if (err) {
            throw err;
        }
        else{
            var adviceMsg = "";
            
            if(playerStats.visionScore >= doc.visionScore/doc.gamePlayed && playerStats.killParticipation >= doc.killParticipation/doc.gamePlayed && playerStats.totalDamageDealt >= doc.totalDamageDealt/doc.gamePlayed && playerStats.totalMinionKilled >= doc.totalMinionKilled/doc.gamePlayed){
               adviceMsg += "Tu as de meilleurs stats que les personnes de ton niveau, tu devrais passer à la ligue superieur, ce n'est qu'une question de temps. Continue comme ca !!"
            }
            else{
                adviceMsg += 'Afin de progresser, voici quelques conseils :';
                var winRate = +(playerStats.win/(playerStats.loose+playerStats.win)*100).toFixed(2);
                
                if(doc.mid > doc.jungle && doc.mid >doc.top && doc.mid >doc.support && doc.mid >doc.adc){
                   adviceMsg += "\n - " + playerStats.nomChampion + " se joue " + playerStats.mid+"% du temps Mid";
                }
                else if(doc.top > doc.jungle && doc.top >doc.mid && doc.top >doc.support && doc.top >doc.adc){
                    adviceMsg += "\n - " + playerStats.nomChampion + " se joue " + playerStats.top+"% du temps Top";
                }
                else if(doc.jungle > doc.mid && doc.jungle >doc.top && doc.jungle >doc.support && doc.jungle >doc.adc){
                    adviceMsg += "\n - " + playerStats.nomChampion + " se joue " + playerStats.jungle+"% du temps Jungle";
                }
                else if(doc.adc > doc.jungle && doc.adc >doc.top && doc.adc >doc.support && doc.adc >doc.mid){
                    adviceMsg += "\n - " + playerStats.nomChampion + " se joue " + playerStats.adc+"% du temps Adc";
                }
                else if(doc.support > doc.jungle && doc.support >doc.top && doc.support >doc.mid && doc.support >doc.adc){
                    adviceMsg += "\n - " + playerStats.nomChampion + " se joue " + playerStats.support+"% du temps Support";
                }
                if(winRate < 50){
                    adviceMsg += "\n - Ton winrate est de " + winRate + "%, cela veut dire que tu as un impact potentiellement négatif pour ton équipe dans la partie, il peut y avoir beaucoup de raisons liés à ça. Pense notamment à regarder les matchups à ton avantage avant de choisir ton champion.";
                }
                
                if(playerStats.totalMinionKilled < (doc.totalMinionKilled)/doc.gamePlayed){
                    var differenceCreeps = ((doc.totalMinionKilled)/doc.gamePlayed) - playerStats.totalMinionKilled;
                    adviceMsg += "\n - Pense à ameliorer ton farming. Tu as " + +(differenceCreeps).toFixed(2) + " creeps/par game de moins que les joueurs de ton niveau.";
                }
                else{
                    adviceMsg += "\n - Tu as un meilleur farming que les joueurs de ce niveau.";
                }
                
                if(playerStats.visionScore < (doc.visionScore)/doc.gamePlayed){
                    var differenceVision = ((doc.visionScore)/doc.gamePlayed)-playerStats.visionScore;
                    adviceMsg += "\n - Il faudrait penser à poser plus de ward. Tu en as posé " + playerStats.visionScore + " soit " + +(differenceVision).toFixed(2) + " de moins que les joueurs de " + playerStats.nomChampion + " à ton elo.";
                }
                else{
                    adviceMsg += "\n - Ton warding est bon mais n'oublies pas que la vision est primordiale et ne doit jamais être délaissée."
                }
                
                if(playerStats.death > (doc.death)/doc.gamePlayed && playerStats.visionScore < (doc.visionScore)/doc.gamePlayed){
                    adviceMsg += "\n - Attention au timming gank et à ton positionnement! Tu meurs " + +((playerStats.death/((doc.death)/doc.gamePlayed))).toFixed(2) + " fois plus que tes adversaires."+" Penses à avoir la vision nécessaire avant d'engager une action risquée, cela t'aidera à prendre une meilleure décision."; 
                }
                if(playerStats.jungle > playerStats.mid && playerStats.jungle >playerStats.top && playerStats.jungle >playerStats.support && playerStats.jungle >playerStats.adc && playerStats.killParticipation < (doc.killParticipation)/doc.gamePlayed){
                    adviceMsg += "\n - Quand tu es Jungle, pense à regarder la position et l'aggressivité des lanes afin de leur apporter ton aide. Il faut généralement prioriser les ganks au farm de la jungle.";
                }
                if(playerStats.killParticipation < (doc.killParticipation)/doc.gamePlayed){
                    adviceMsg += "\n - N'oublies pas que c'est un jeu d'équipe avant tout et tu dois jouer avec celle-ci pour gagner!";
                }
                if((doc.totalDamageDealt)/doc.gamePlayed > playerStats.totalDamageDealt){
                    var diffDamage = ((doc.totalDamageDealt)/doc.gamePlayed) - playerStats.totalDamageDealt;
                    adviceMsg += "\n - Essaie de jouer plus aggressif tu fais " + +(diffDamage).toFixed(2) + " de moins de degats par game que tes adversaires sur le champion!";
                }
                if(((doc.totalDamageDealt)/doc.gamePlayed) < playerStats.totalDamageDealt && playerStats.death > doc.death/doc.gamePlayed){
                    var diffDamage = playerStats.totalDamageDealt-(doc.totalDamageDealt)/doc.gamePlayed;
                    adviceMsg += "\n - Essaie de jouer moins aggressif tu fais " + +(diffDamage).toFixed(2) + " de plus de degats par game que les joueurs de ce champion mais tu meurs trop souvent. Ne sois pas trop aggressif.";
                }
            }
        }

        var ConseilStats = {
            playerStatsAll: playerStats,
            
            ligueStatsLigue:                        playerStats.ligue,
            ligueStatsIdChampion:                   doc.idChampion,
            ligueStatsNomChampion:                  doc.nomChampion,
            ligueStatsLoose:                        +((doc.loose)/doc.gamePlayed*100).toFixed(0),
            ligueStatsWin:                          +((doc.win)/doc.gamePlayed*100).toFixed(0),
            ligueStatsBan:                          +((doc.ban)/doc.gamePlayed*100).toFixed(0),
            ligueStatsGameDuration:                 +((doc.gameDuration)/doc.gamePlayed).toFixed(0),
            ligueStatsAssists:                      +((doc.assists)/doc.gamePlayed).toFixed(0),
            ligueStatsKill:                         +((doc.kill)/doc.gamePlayed).toFixed(0),
            ligueStatsDeath:                        +((doc.death)/doc.gamePlayed).toFixed(0),
            ligueStatsKillParticipation:            +((doc.killParticipation)/doc.gamePlayed).toFixed(0),
            ligueStatsTotalDamageDealt:             +((doc.totalDamageDealt)/doc.gamePlayed).toFixed(0),
            ligueStatsVisionScore:                  +((doc.visionScore)/doc.gamePlayed).toFixed(0),
            ligueStatsGoldEarned:                   +((doc.goldEarned)/doc.gamePlayed).toFixed(0),
            ligueStatsTotalMinionKilled:            +((doc.totalMinionKilled)/doc.gamePlayed).toFixed(0),
            ligueStatsVisionWardsBoughtInGame:      +((doc.visionWardsBoughtInGame)/doc.gamePlayed).toFixed(0),
            ligueStatsTotalTimeCrowdControlDealt:   +((doc.totalTimeCrowdControlDealt)/doc.gamePlayed).toFixed(0),
            ligueStatsMid:                          +((doc.mid)/doc.gamePlayed*100).toFixed(0),
            ligueStatsTop:                          +((doc.top)/doc.gamePlayed*100).toFixed(0),
            ligueStatsJungle:                       +((doc.jungle)/doc.gamePlayed*100).toFixed(0),
            ligueStatsSupport:                      +((doc.support)/doc.gamePlayed*100).toFixed(0),
            ligueStatsAdc:                          +((doc.adc)/doc.gamePlayed*100).toFixed(0),
            ligueStatsGamePlayed:                   doc.gamePlayed,

            //si joueur pas concerné par conseil alors conseil pas send
            advice: adviceMsg  
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
            StatsChall.killParticipation = +(StatsChall.killParticipation/StatsChall.gamePlayed).toFixed(2); //en%
            StatsChall.totalDamageDealt = +(StatsChall.totalDamageDealt/StatsChall.gamePlayed).toFixed(2);
            StatsChall.visionScore = +(StatsChall.visionScore/StatsChall.gamePlayed).toFixed(2);
            StatsChall.goldEarned = +(StatsChall.goldEarned/StatsChall.gamePlayed).toFixed(2);           
            StatsChall.totalMinionKilled = +(StatsChall.totalMinionKilled/StatsChall.gamePlayed).toFixed(2);


            // FARM
            if (playerStats.totalMinionKilled >= StatsChall.totalMinionKilled){
                notes.Farm = 10;
            }
            else{
                notes.Farm = +((playerStats.totalMinionKilled/StatsChall.totalMinionKilled)*10).toFixed(2);
            }
            // VISION
            if (playerStats.visionScore >= StatsChall.visionScore){
                notes.Vision = 10;
            }
            else{
                notes.Vision = +((playerStats.visionScore/StatsChall.visionScore)*10).toFixed(2);
            }
            //DEGATS
            if (playerStats.totalDamageDealt >= StatsChall.totalDamageDealt){
                notes.Damage = 10;
            }
            else{
                notes.Damage = +((playerStats.totalDamageDealt/StatsChall.totalDamageDealt)*10).toFixed(2);
            }
            //GOLDS
            if (playerStats.goldEarned >= StatsChall.goldEarned){
                notes.Golds = 10;
            }
            else{
                notes.Golds = +((playerStats.goldEarned/StatsChall.goldEarned)*10).toFixed(2);
            }
            // killParticipation
            if (playerStats.killParticipation >= StatsChall.killParticipation){
                notes.killParticipation = 10;
            }
            else{
                notes.killParticipation = +((playerStats.killParticipation/StatsChall.killParticipation)*10).toFixed(2);
            }
            var DataSending = {
                statsTab:ConseilStats,
                notesTab:notes
            }
            
            res.send(DataSending);
            console.log('Sent');
        });
    });
}
///finAnalysePlayer///

///statsParChampion///
function getStatChampion() {
    app.get('/champion/:champ/:leag', (req, res) => {
        
        var champName = req.params.champ;
        var league = req.params.leag;
        
        console.log(champName + league);
    
        const collection = client.db("CHAMPIONS").collection(league);

        collection.findOne( {"nomChampion": champName }, (err, doc) => {
            if (err) {
                throw err;
            }
                            
            doc.loose = +(doc.loose/doc.gamePlayed*100).toFixed(2);
            doc.win = +(doc.win/doc.gamePlayed*100).toFixed(2);
            doc.gameDuration = +(doc.gameDuration/doc.gamePlayed).toFixed(2);
            doc.assists = +(doc.assists/doc.gamePlayed).toFixed(2);
            doc.kill = +(doc.kill/doc.gamePlayed).toFixed(2);
            doc.death = +(doc.death/doc.gamePlayed).toFixed(2);
            doc.killParticipation = +(doc.killParticipation/doc.gamePlayed).toFixed(2); //en%
            doc.totalDamageDealt = +(doc.totalDamageDealt/doc.gamePlayed).toFixed(2);
            doc.visionScore = +(doc.visionScore/doc.gamePlayed).toFixed(2);
            doc.goldEarned = +(doc.goldEarned/doc.gamePlayed).toFixed(2);           
            doc.totalMinionKilled = +(doc.totalMinionKilled/doc.gamePlayed).toFixed(2);
            doc.visionWardsBoughtInGame = +(doc.visionWardsBoughtInGame/doc.gamePlayed).toFixed(2);
            doc.totalTimeCrowdControlDealt = +(doc.totalTimeCrowdControlDealt/doc.gamePlayed).toFixed(2);
            doc.mid = +(doc.mid/doc.gamePlayed*100).toFixed(2);
            doc.top = +(doc.top/doc.gamePlayed*100).toFixed(2);
            doc.jungle = +(doc.jungle/doc.gamePlayed*100).toFixed(2);
            doc.support = +(doc.support/doc.gamePlayed*100).toFixed(2);
            doc.adc = +(doc.adc/doc.gamePlayed*100).toFixed(2);

            res.send(doc);

            console.log('Final : ' + doc);

            
        });
    });
}
///finStatsParChampion///

///randomGameAdvices///
function getRandAdvice(){
    app.get('/', (req, res) => {
        var TabRandAdvices = [
        "Il est important de regarder souvent sa minimap pour avoir une meilleure visibilité",
        "Prendre des objectifs tels qu'un dragon ou une tour aura toujours plus d'impact qu'un kill",
        "Un solo kill correspond environ à 15 creeps, bien farm est donc tout aussi important que de prendre des kills en phase de lane",
        "L'herald est un objectif très fort en début de partie, il apparaît à 8 minutes et peut réapparaître 6 minutes après avoir été tué avant que le nashor apparaisse à 20min",
        "En phase de lane, il est primordial de faire attention à son placement et ses déplacements",
        "Tous les champions ont des match up positifs et négatifs, il est nécessaire d'en prendre compte pour mieux exploiter vos forces et vos faiblesses",
        "La connaissances des sorts des champions et leur cooldowns est importante pour prendre les bonnes aggressions",
        "Chaque partie est différente, il est important de savoir s'adapter en fonction des situations et de ne pas faire toujours la même chose",
        "Le mental est clé pour pouvoir s'améliorer",
        "Il est judicieux de se concentrer sur ses propres erreurs plutôt que les erreurs des coéquipiers",
        "Revoir ses parties peut permettre de mieux cibler ses erreurs pour pouvoir les corriger",
        "Pour bien progresser sur LoL, il faut connaître son rôle sur le bout des doigts",
        "N'hésitez pas à vous inspirer de joueurs professionnels pour vos runes et builds si vous ne maîtrisez pas bien un champion",
        "La première tourelle du top et du mid possède une protection augmentée avant les 5min de jeu.",
        "L'existence du champion Yuumi est une erreur",
        "Un jungler a besoin de la pression de ses lanes pour pouvoir s'exprimer librement en early",
        "Se concentrer sur la maîtrise de quelques champions plutôt qu'une vingtaine vous fera gagner plus souvent",
        "Savoir où se trouve le jungler adverse est important lorsque vous dominez votre lane",
        "Désactiver le chat peut vous permettre d'être plus concentré durant vos parties",
        "Sardoche est delusionnal",
        "Chaque plate de tour rapporte 160 golds, ce qui fait un total de 1200 golds si la tour est détruite avant 14 minutes"
    ];
        var TabLength =  TabRandAdvices.length;
        var  n = Math.floor(Math.random() * TabLength);
        console.log(TabRandAdvices[n]);
        res.send(TabRandAdvices[n]);
    });
}
///finRandomGameAdvices///

app.listen(8080, () => {
    console.log("started at http://localhost:8080/");
});

client.connect(err => {
    if (err) {
        console.log('Sorry unable to connect to MongoDB Error:', err);
    } else {
        console.log('Connected successfully to server', uri);
        
        app.get('/Conseil/:invocateurName/:champion',(req,res)=> {
            playerStats ={
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
            
            recuperationAccountId(req.params.invocateurName, req.params.champion, res);        
        });
        getStatChampion();
        getRandAdvice();
    }
});