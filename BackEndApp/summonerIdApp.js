const MongoClient = require('mongodb').MongoClient;

const uri = "mongodb+srv://smoop:c30MNpjC4hCu1Gj0@clustername-uocwt.mongodb.net";

const client = new MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true});

const request = require('request');

var infos = [
    ["IRON", "3", "4", "I", "II", "III", "IV"],
    ["BRONZE", "3", "4", "I", "II", "III", "IV"],
    ["SILVER", "3", "4", "I", "II", "III", "IV"],
    ["GOLD", "3", "4", "I", "II", "III", "IV"],
    ["PLATINUM", "4", "4", "I", "II", "III", "IV"],
    ["DIAMOND", "4", "4", "I", "II", "III", "IV"],
    ["MASTER", "5", "1", "I"],
    ["GRANDMASTER", "4", "1", "I"],
    ["CHALLENGER", "2", "1", "I"],
    ["FIN"]
]


function getAllSumId() {
    
    infos.forEach( (elem, index, array) => {
        setTimeout( function() {
            infos[index].forEach( (el, ind, arr) => {
                setTimeout( function() {
                    console.log('Rank : ' + infos[index][0] + ' -> Index : ' + ind + ' -> elem : ' + el);  

                    if(ind >= 3) {
                        console.log('CONDITION -> Rank : ' + infos[index][0] + ' -> Index : ' + ind + ' -> elem : ' + el);  
                        temp(infos[index][0], el, index);
                    }
                    
                }, ind * 3000);    
            });         
        }, index * 30000);
    });
}

function temp(league, rank, n){
        
    for (var page = 1; page <= infos[n][1]; page++) {
        console.log('rank : ' + n + ' -> RANKED_SOLO_5x5/'+league+'/'+rank+'?page='+page);

        var option = {
          method: 'GET',
          url: 'https://euw1.api.riotgames.com/lol/league-exp/v4/entries/RANKED_SOLO_5x5/'+league+'/'+rank+'?page='+page,
          qs: {api_key: 'RGAPI-3c147dce-9a00-4232-9340-e36bf64fd9ea'}
        };


        request(option, function (error, response, body) {
            if (error) {
                console.log('Sorry unable to execute request. Error:', err);
            } else {

                var bodyJson = JSON.parse(body);

                for(var j = 0; j < bodyJson.length; j++){

                    const collection = client.db(league).collection(bodyJson[j].rank);  //(n+1).toString()
                    //Info a push dans dB
                    var data = {
                        "summonerId":bodyJson[j].summonerId,
                        "ligue":bodyJson[j].tier,
                        "name":bodyJson[j].summonerName
                    };
                    console.log('Push in DB : Rank ' + league + ' Page : ' + page +  ' - >' + j + " "+ data.name);
                    collection.insertOne(data, (error, result) => {
                        if(error){
                            throw error;
                        }
                    });
                }
            }
        });
    }    
}

//START CLIENT
client.connect(err => {
    if (err) {
        console.log('Sorry unable to connect to MongoDB Error:', err);
    } else {
        console.log('Connected successfully to server', uri);
        
        getAllSumId();

    }
});