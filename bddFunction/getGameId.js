const MongoClient = require('mongodb').MongoClient;

const uri = "mongodb+srv://smoop:c30MNpjC4hCu1Gj0@clustername-uocwt.mongodb.net";

const client = new MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true});

const leagueArray = ["IRON", "BRONZE", "SILVER", "GOLD", "PLATINUM", "DIAMOND", "MASTER", "GRANDMASTER", "CHALLENGER"];

//const delay = [2420, 2420, 2420, 2420, 3220, 3220, 1025, 700, 300];
const delay = [0, 2450, 4900, 7350, 9800, 13050, 16300, 17350, 18100];
//const delay = [0, 24, 49, 73, 98, 130, 163, 173, 181];
// 0    1    2      3       4   5       6     7     8
// 24 -> 24 -> 24 -> 24 -> 32 -> 32 -> 10 -> 7 -> 3

function getAccId(n){
    
    const collection = client.db("USERS").collection(leagueArray[n]); 
    
    collection.find().toArray( (err, docs) => {
        if(err){
            throw err;   
        }
        
        docs.forEach( (elem, index) => {
            setTimeout( function() {      
                if(elem.accountId !== null){
                    console.log(n+ ' --> Compte n° ' + index + ' : ' + elem.accountId);
                    if(elem.accountId === null){
                        console.log(' NUL NUL NUL ');
                        var nulData = {
                            "name": elem.nameMdb,
                            "ligue": elem.ligue,
                            "summonerId": elem.summonerId
                        };
                        pushGameId("BAD_ACCOUNT_ID", nulData, n);
                        
                    } else {
                        getGameId(elem.accountId, n);         
                    }
                } 
           }, index * 1500); 
        });
    });
}


function getGameId(account, n) {
    const request = require('request');
    var typeGame = '420';
    var indexMax = '20';
    var options = {
        method: 'GET',
        url: 'https://euw1.api.riotgames.com/lol/match/v4/matchlists/by-account/'+account+ '?queue='+typeGame+'&endIndex='+indexMax,
        qs: {api_key: 'RGAPI-158094c4-cc33-4dd2-97a5-8a5b2eb8e6ee'}
    };
    
    request(options, (err, response, body) => {
        if (err) {
            console.log('Sorry unable to execute request. Error:', err);
        } else {
            var bodyJson = JSON.parse(body);
            
            if(bodyJson.matches === undefined){
                console.log('UNDEFINED UNDEFINED UNDEFINED');
                var badData = {
                    "accountId": account,
                    "gameId": 0
                };
                pushGameId("BAD_ACCOUNT_ID", badData, n);
                
            } else {
                for(var i = 0; i < bodyJson.matches.length; i++) {
                    var gameData = {
                        "gameId": bodyJson.matches[i].gameId,
                        "timestamp": bodyJson.matches[i].timestamp
                    };
                    pushGameId("GAME_ID", gameData, n);
                }
            }
            
        }
    });
}

function pushGameId(str, data, n) {
    //Le client est deja connecte
    const collection = client.db(str).collection(leagueArray[n]); 

    collection.insertOne(data, (err, res) => {
        if(err){
            throw err;
        } 
        console.log(data.gameId + ' -> push successful');
    });
}


client.connect(err => {
    if (err) {
        console.log('Sorry unable to connect to MongoDB Error:', err);
    } else {
        console.log('Connected successfully to server', uri);

        leagueArray.forEach( (elem, index) => {
            setTimeout( function() {
                getAccId(index);

           }, delay[index] * 1500); 
        });
        
    }
});

