//Serveur
const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://smoop:c30MNpjC4hCu1Gj0@clustername-uocwt.mongodb.net";

//const uri = "mongodb+srv://Pierre-Louis:cad724786@loremipsum-s6o5x.gcp.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true});
const app = express();
app.use(express.json());


const apiKey = 'RGAPI-7716bbe8-4a9b-4308-b5b5-15de08b5cf5e';
//var ligue = 'ADEF';
var rank = 'I';
var pageMax = 3;
var counter;

var pageMaxLigue = new Map();    
pageMaxLigue.set('IRON', '3');
pageMaxLigue.set('BRONZE', '3');
pageMaxLigue.set('SILVER', '3');
pageMaxLigue.set('GOLD', '4');
pageMaxLigue.set('PLATINUM', '4');
pageMaxLigue.set('DIAMOND', '4');
pageMaxLigue.set('MASTER', '5');
pageMaxLigue.set('GRANDMASTER', '5');
pageMaxLigue.set('CHALLENGER', '5');

var rankMaxParLigue = new Map();
rankMaxParLigue.set('IRON', '4');
rankMaxParLigue.set('BRONZE', '4');
rankMaxParLigue.set('SILVER', '4');
rankMaxParLigue.set('GOLD', '4');
rankMaxParLigue.set('PLATINUM', '4');
rankMaxParLigue.set('DIAMOND', '4');
rankMaxParLigue.set('MASTER', '1');
rankMaxParLigue.set('GRANDMASTER', '1');
rankMaxParLigue.set('CHALLENGER', '1');



function delaySwitch(){///1sec
    switch (counter) {
        case 0:
            function requestIron(){
                var pageMax = pageMaxLigue.get('IRON');
                var rankMax = rankMaxParLigue.get('IRON');
                var ligue = 'IRON';
                
                client.connect(err => {
                        if (err) {
                            console.log('Sorry unable to connect to MongoDB Error:', err);
                        } else {
                            console.log('Connected successfully to server', uri);

                            for (var i = 1; i <= rankMax; i++) {
                                for (var page = 1; page <= pageMax; page++) {

                                    var request = require("request");
                                    const game = 'RANKED_SOLO_5x5';
                                    var option = {
                                      method: 'GET',
                                      url: 'https://euw1.api.riotgames.com/lol/league-exp/v4/entries/'+game+'/'+ligue+'/'+rank+'?page='+page,
                                      qs: {api_key: apiKey}
                                    };
                                    //console.log(ligue + " " + rank + " "+ page);
                                    request(option, function (error, response, body) {
                                        if (error) throw new Error(error);        
                                        var bodyJson = JSON.parse(body);
                                        for(var i =0; i< bodyJson.length;i++){
                                            
                                            const collection = client.db(bodyJson[i].tier).collection(bodyJson[i].rank); 
                                            //Info a push dans dB
                                            var data = {
                                                "summonerId":bodyJson[i].summonerId,
                                                "ligue":bodyJson[i].tier,
                                                "name":bodyJson[i].summonerName,
                                            };
                                            collection.insertOne(data, (error, result) =>{
                                                if(error){
                                                    throw error;
                                                }
                                                else{
                                                    console.log("OK Iron");
                                                }
                                            });
                                            //console.log(i + " " + bodyJson[i].summonerId + " "+ bodyJson[i].summonerName);
                                        }
                                    });
                                }
                                rank += 'I';
                                if (rank === 'IIII') {
                                    rank = 'IV';
                                }
                                if (rank === 'IVI') {
                                    ligue = 'BRONZE';
                                    rank = 'I';
                                    page = 1;
                                }
                            }
                            
                        }
                });
            }
            requestIron();
            counter++;
            console.log("COUNTER " + counter);
            break;

        case 1:
            function requestBronze() {
                var pageMax = pageMaxLigue.get('BRONZE');
                var rankMax = rankMaxParLigue.get('BRONZE');
                var ligue = 'BRONZE';
                
                client.connect(err => {
                        if (err) {
                            console.log('Sorry unable to connect to MongoDB Error:', err);
                        } else {
                            console.log('Connected successfully to server', uri);

                            for (var i = 1; i <= rankMax; i++) {
                                for (var page = 1; page <= pageMax; page++) {

                                    var request = require("request");
                                    const game = 'RANKED_SOLO_5x5';
                                    var option = {
                                      method: 'GET',
                                      url: 'https://euw1.api.riotgames.com/lol/league-exp/v4/entries/'+game+'/'+ligue+'/'+rank+'?page='+page,
                                      qs: {api_key: apiKey}
                                    };
                                    //console.log(ligue + " " + rank + " "+ page);
                                    request(option, function (error, response, body) {
                                        if (error) throw new Error(error);        
                                        var bodyJson = JSON.parse(body);
                                        for(var i =0; i< bodyJson.length;i++){
                                            
                                            const collection = client.db(bodyJson[i].tier).collection(bodyJson[i].rank); 
                                            //Info a push dans dB
                                            var data = {
                                                "summonerId":bodyJson[i].summonerId,
                                                "ligue":bodyJson[i].tier,
                                                "name":bodyJson[i].summonerName,
                                            };
                                            collection.insertOne(data, (error, result) =>{
                                                if(error){
                                                    throw error;
                                                }
                                                else{
                                                    console.log("OK Bronze");
                                                }
                                            });
                                            //console.log(i + " " + bodyJson[i].summonerId + " "+ bodyJson[i].summonerName);
                                        }
                                    });
                                }
                                rank += 'I';
                                if (rank === 'IIII') {
                                    rank = 'IV';
                                }
                                if (rank === 'IVI') {
                                    ligue = 'SILVER';
                                    rank = 'I';
                                    page = 1;
                                }
                            }
                            
                        }
                });            
            }
            requestBronze(); 
            counter++;
            console.log("COUNTER " + counter);
            break;

        case 2:
            function requestSilver() {
                var pageMax = pageMaxLigue.get('SILVER');
                var rankMax = rankMaxParLigue.get('SILVER');
                var ligue = 'SILVER';
                
                client.connect(err => {
                        if (err) {
                            console.log('Sorry unable to connect to MongoDB Error:', err);
                        } else {
                            console.log('Connected successfully to server', uri);

                            for (var i = 1; i <= rankMax; i++) {
                                for (var page = 1; page <= pageMax; page++) {

                                    var request = require("request");
                                    const game = 'RANKED_SOLO_5x5';
                                    var option = {
                                      method: 'GET',
                                      url: 'https://euw1.api.riotgames.com/lol/league-exp/v4/entries/'+game+'/'+ligue+'/'+rank+'?page='+page,
                                      qs: {api_key: apiKey}
                                    };
                                    //console.log(ligue + " " + rank + " "+ page);
                                    request(option, function (error, response, body) {
                                        if (error) throw new Error(error);        
                                        var bodyJson = JSON.parse(body);
                                        for(var i =0; i< bodyJson.length;i++){
                                            
                                            const collection = client.db(bodyJson[i].tier).collection(bodyJson[i].rank); 
                                            //Info a push dans dB
                                            var data = {
                                                "summonerId":bodyJson[i].summonerId,
                                                "ligue":bodyJson[i].tier,
                                                "name":bodyJson[i].summonerName,
                                            };
                                            collection.insertOne(data, (error, result) =>{
                                                if(error){
                                                    throw error;
                                                }
                                                else{
                                                    console.log("OK Gold");
                                                }
                                            });
                                            //console.log(i + " " + bodyJson[i].summonerId + " "+ bodyJson[i].summonerName);
                                        }
                                    });
                                }
                                rank += 'I';
                                if (rank === 'IIII') {
                                    rank = 'IV';
                                }
                                if (rank === 'IVI') {
                                    ligue = 'GOLD';
                                    rank = 'I';
                                    page = 1;
                                }
                            }
                            
                        }
                });
            }
            requestSilver();
            counter++;
            console.log("COUNTER " + counter);
            break;

        case 3:
            function requestGold() {
                var pageMax = pageMaxLigue.get('GOLD');
                var rankMax = rankMaxParLigue.get('GOLD');
                var ligue = 'GOLD';
                
                client.connect(err => {
                        if (err) {
                            console.log('Sorry unable to connect to MongoDB Error:', err);
                        } else {
                            console.log('Connected successfully to server', uri);

                            for (var i = 1; i <= rankMax; i++) {
                                for (var page = 1; page <= pageMax; page++) {

                                    var request = require("request");
                                    const game = 'RANKED_SOLO_5x5';
                                    var option = {
                                      method: 'GET',
                                      url: 'https://euw1.api.riotgames.com/lol/league-exp/v4/entries/'+game+'/'+ligue+'/'+rank+'?page='+page,
                                      qs: {api_key: apiKey}
                                    };
                                    //console.log(ligue + " " + rank + " "+ page);
                                    request(option, function (error, response, body) {
                                        if (error) throw new Error(error);        
                                        var bodyJson = JSON.parse(body);
                                        for(var i =0; i< bodyJson.length;i++){
                                            
                                            const collection = client.db(bodyJson[i].tier).collection(bodyJson[i].rank); 
                                            //Info a push dans dB
                                            var data = {
                                                "summonerId":bodyJson[i].summonerId,
                                                "ligue":bodyJson[i].tier,
                                                "name":bodyJson[i].summonerName,
                                            };
                                            collection.insertOne(data, (error, result) =>{
                                                if(error){
                                                    throw error;
                                                }
                                                else{
                                                    console.log("OK Gold");
                                                }
                                            });
                                            //console.log(i + " " + bodyJson[i].summonerId + " "+ bodyJson[i].summonerName);
                                        }
                                    });
                                }
                                rank += 'I';
                                if (rank === 'IIII') {
                                    rank = 'IV';
                                }
                                if (rank === 'IVI') {
                                    ligue = 'PLATINUM';
                                    rank = 'I';
                                    page = 1;
                                }
                            }
                            
                        }
                });
                
            }
            requestGold();
            counter++;
            console.log("COUNTER " + counter);
            break;

        case 4:
            function requestPlatinum() {
                var pageMax = pageMaxLigue.get('PLATINUM');
                var rankMax = rankMaxParLigue.get('PLATINUM');
                var ligue = 'PLATINUM';
                
                client.connect(err => {
                        if (err) {
                            console.log('Sorry unable to connect to MongoDB Error:', err);
                        } else {
                            console.log('Connected successfully to server', uri);

                            for (var i = 1; i <= rankMax; i++) {
                                for (var page = 1; page <= pageMax; page++) {

                                    var request = require("request");
                                    const game = 'RANKED_SOLO_5x5';
                                    var option = {
                                      method: 'GET',
                                      url: 'https://euw1.api.riotgames.com/lol/league-exp/v4/entries/'+game+'/'+ligue+'/'+rank+'?page='+page,
                                      qs: {api_key: apiKey}
                                    };
                                    //console.log(ligue + " " + rank + " "+ page);
                                    request(option, function (error, response, body) {
                                        if (error) throw new Error(error);        
                                        var bodyJson = JSON.parse(body);
                                        for(var i =0; i< bodyJson.length;i++){
                                            
                                            const collection = client.db(bodyJson[i].tier).collection(bodyJson[i].rank); 
                                            //Info a push dans dB
                                            var data = {
                                                "summonerId":bodyJson[i].summonerId,
                                                "ligue":bodyJson[i].tier,
                                                "name":bodyJson[i].summonerName,
                                            };
                                            collection.insertOne(data, (error, result) =>{
                                                if(error){
                                                    throw error;
                                                }
                                                else{
                                                    console.log("OK Plat");
                                                }
                                            });
                                            //console.log(i + " " + bodyJson[i].summonerId + " "+ bodyJson[i].summonerName);
                                        }
                                    });
                                }
                                rank += 'I';
                                if (rank === 'IIII') {
                                    rank = 'IV';
                                }
                                if (rank === 'IVI') {
                                    ligue = 'DIAMOND';
                                    rank = 'I';
                                    page = 1;
                                }
                            }
                            
                        }
                });
            }
            requestPlatinum();
            counter++;
            console.log("COUNTER " + counter);
            break;

        case 5:
            function requestDiamond() {
                var pageMax = pageMaxLigue.get('DIAMOND');
                var rankMax = rankMaxParLigue.get('DIAMOND');
                var ligue ='DIAMOND';

                client.connect(err => {
                        if (err) {
                            console.log('Sorry unable to connect to MongoDB Error:', err);
                        } else {
                            console.log('Connected successfully to server', uri);

                            for (var i = 1; i <= rankMax; i++) {
                                for (var page = 1; page <= pageMax; page++) {

                                    var request = require("request");
                                    const game = 'RANKED_SOLO_5x5';
                                    var option = {
                                      method: 'GET',
                                      url: 'https://euw1.api.riotgames.com/lol/league-exp/v4/entries/'+game+'/'+ligue+'/'+rank+'?page='+page,
                                      qs: {api_key: apiKey}
                                    };
                                    //console.log(ligue + " " + rank + " "+ page);
                                    request(option, function (error, response, body) {
                                        if (error) throw new Error(error);        
                                        var bodyJson = JSON.parse(body);
                                        for(var i =0; i< bodyJson.length;i++){
                                            
                                            const collection = client.db(bodyJson[i].tier).collection(bodyJson[i].rank); 
                                            //Info a push dans dB
                                            var data = {
                                                "summonerId":bodyJson[i].summonerId,
                                                "ligue":bodyJson[i].tier,
                                                "name":bodyJson[i].summonerName,
                                            };
                                            collection.insertOne(data, (error, result) =>{
                                                if(error){
                                                    throw error;
                                                }
                                                else{
                                                    console.log("OK Diamond");
                                                }
                                            });
                                            //console.log(i + " " + bodyJson[i].summonerId + " "+ bodyJson[i].summonerName);
                                        }
                                    });
                                }
                                rank += 'I';
                                if (rank === 'IIII') {
                                    rank = 'IV';
                                }
                                if (rank === 'IVI') {
                                    ligue = 'MASTER';
                                    rank = 'I';
                                    page = 1;
                                }
                            }
                            
                        }
                });
            }
            requestDiamond();
            counter++;
            console.log("COUNTER " + counter);
            break;

        case 6:
            function requestMaster() {
                var pageMax = pageMaxLigue.get('MASTER');
                var rankMax = rankMaxParLigue.get('MASTER');
                var ligue = 'MASTER';
                
                client.connect(err => {
                        if (err) {
                            console.log('Sorry unable to connect to MongoDB Error:', err);
                        } else {
                            console.log('Connected successfully to server', uri);

                            for (var i = 1; i <= rankMax; i++) {
                                for (var page = 1; page <= pageMax; page++) {

                                    var request = require("request");
                                    const game = 'RANKED_SOLO_5x5';
                                    var option = {
                                      method: 'GET',
                                      url: 'https://euw1.api.riotgames.com/lol/league-exp/v4/entries/'+game+'/'+ligue+'/'+rank+'?page='+page,
                                      qs: {api_key: apiKey}
                                    };
                                    //console.log(ligue + " " + rank + " "+ page);
                                    request(option, function (error, response, body) {
                                        if (error) throw new Error(error);        
                                        var bodyJson = JSON.parse(body);
                                        for(var i =0; i< bodyJson.length;i++){
                                            
                                            const collection = client.db(bodyJson[i].tier).collection(bodyJson[i].rank); 
                                            //Info a push dans dB
                                            var data = {
                                                "summonerId":bodyJson[i].summonerId,
                                                "ligue":bodyJson[i].tier,
                                                "name":bodyJson[i].summonerName,
                                            };
                                            collection.insertOne(data, (error, result) =>{
                                                if(error){
                                                    throw error;
                                                }
                                                else{
                                                    console.log("OK Master");
                                                }
                                            });
                                            //console.log(i + " " + bodyJson[i].summonerId + " "+ bodyJson[i].summonerName);
                                        }
                                    });
                                }
                                if (rank === 'I') {
                                    ligue = 'GRANDMASTER';
                                }
                            }
                        }
                });
                
            }
            requestMaster();
            counter++;
            console.log("COUNTER " + counter);
            break;

        case 7:
            function requestGMaster() {
                var pageMax = pageMaxLigue.get('GRANDMASTER');
                var rankMax = rankMaxParLigue.get('GRANDMASTER');
                var ligue = 'GRANDMASTER';
                
                client.connect(err => {
                        if (err) {
                            console.log('Sorry unable to connect to MongoDB Error:', err);
                        } else {
                            console.log('Connected successfully to server', uri);

                            for (var i = 1; i <= rankMax; i++) {
                                for (var page = 1; page <= pageMax; page++) {

                                    var request = require("request");
                                    const game = 'RANKED_SOLO_5x5';
                                    var option = {
                                      method: 'GET',
                                      url: 'https://euw1.api.riotgames.com/lol/league-exp/v4/entries/'+game+'/'+ligue+'/'+rank+'?page='+page,
                                      qs: {api_key: apiKey}
                                    };
                                    //console.log(ligue + " " + rank + " "+ page);
                                    request(option, function (error, response, body) {
                                        if (error) throw new Error(error);        
                                        var bodyJson = JSON.parse(body);
                                        for(var i =0; i< bodyJson.length;i++){
                                            
                                            const collection = client.db(bodyJson[i].tier).collection(bodyJson[i].rank); 
                                            //Info a push dans dB
                                            var data = {
                                                "summonerId":bodyJson[i].summonerId,
                                                "ligue":bodyJson[i].tier,
                                                "name":bodyJson[i].summonerName,
                                            };
                                            collection.insertOne(data, (error, result) =>{
                                                if(error){
                                                    throw error;
                                                }
                                                else{
                                                    console.log("OK GrandMaster");
                                                }
                                            });
                                            //console.log(i + " " + bodyJson[i].summonerId + " "+ bodyJson[i].summonerName);
                                        }
                                    });
                                }
                                if (rank === 'I') {
                                    ligue = 'CHALLENGER';
                                }
                            }
                        }
                });
            }
            requestGMaster();
            counter++;
            console.log("COUNTER " + counter);
            break;

        //case 'CHALLENGER':
        case 8:
            function requestChall() {
                var pageMax = pageMaxLigue.get('CHALLENGER');
                var rankMax = rankMaxParLigue.get('CHALLENGER');
                var ligue = 'CHALLENGER';
                
                client.connect(err => {
                        if (err) {
                            console.log('Sorry unable to connect to MongoDB Error:', err);
                        } else {
                            console.log('Connected successfully to server', uri);

                            for (var i = 1; i <= rankMax; i++) {
                                for (var page = 1; page <= pageMax; page++) {

                                    var request = require("request");
                                    const game = 'RANKED_SOLO_5x5';
                                    var option = {
                                      method: 'GET',
                                      url: 'https://euw1.api.riotgames.com/lol/league-exp/v4/entries/'+game+'/'+ligue+'/'+rank+'?page='+page,
                                      qs: {api_key: apiKey}
                                    };
                                    //console.log(ligue + " " + rank + " "+ page);
                                    request(option, function (error, response, body) {
                                        if (error) throw new Error(error);        
                                        var bodyJson = JSON.parse(body);
                                        for(var i =0; i< bodyJson.length;i++){
                                            
                                            const collection = client.db(bodyJson[i].tier).collection(bodyJson[i].rank); 
                                            //Info a push dans dB
                                            var data = {
                                                "summonerId":bodyJson[i].summonerId,
                                                "ligue":bodyJson[i].tier,
                                                "name":bodyJson[i].summonerName,
                                            };
                                            collection.insertOne(data, (error, result) =>{
                                                if(error){
                                                    throw error;
                                                }
                                                else{
                                                    console.log("OK Chall");
                                                }
                                            });
                                            //console.log(i + " " + bodyJson[i].summonerId + " "+ bodyJson[i].summonerName);
                                        }
                                    });
                                }  
                            } 
                        }
                });
                clearInterval(intervalRequest);
            }
            requestChall();
            console.log("COUNTER " + counter+ " chall");
            break;


        default:
            var ligue = 'IRON';
            counter = 0;
            break;
    }   
}

app.listen(8080, () => {
    console.log("started at http://localhost:8080/");
});


intervalRequest = setInterval(delaySwitch,1000);