const MongoClient = require('mongodb').MongoClient;

const uri = "mongodb+srv://smoop:c30MNpjC4hCu1Gj0@clustername-uocwt.mongodb.net";

const client = new MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true});


function getAccId(){
    client.connect(err => {
        if (err) {
            console.log('Sorry unable to connect to MongoDB Error:', err);
        } else {
            console.log('Connected successfully to server', uri);

            const collection = client.db("loremIpsum").collection("usersTest"); 

            collection.find().forEach( id => {
                console.log(JSON.stringify(id.accountId, null, 2));
                console.log('pause');
                getGameId(id.accountId);
            });

        }
    });
}

function getGameId(account) {
    const request = require('request');
    var typeGame = '420';
    var indexMax = '20';
    var options = {
        method: 'GET',
        url: 'https://euw1.api.riotgames.com/lol/match/v4/matchlists/by-account/'+account+ '?queue='+typeGame+'&endIndex='+indexMax,
        qs: {api_key: 'RGAPI-7716bbe8-4a9b-4308-b5b5-15de08b5cf5e'}
    };
    
    request(options, (err, response, body) => {
        if (err) {
            console.log('Sorry unable to execute request. Error:', err);
        } else {
            console.log('Request successfull');
            var bodyJson = JSON.parse(body);
            
            for(var i = 0; i < bodyJson.matches.length; i++) {
                var gameData = {
                    "gameId": bodyJson.matches[i].gameId,
                    "timestamp": bodyJson.matches[i].timestamp
                }
                console.log(gameData);
                pushGameId(gameData);
            }
        }
    });
    
    
}

function pushGameId(data) {
    //Le client est deja connecte
    const collection = client.db("testGameId").collection("I"); 

    collection.insertOne(data, (err, res) => {
        if(err){
            throw err;
        } 
        console.log("Succes");
    });
}

getAccId();
