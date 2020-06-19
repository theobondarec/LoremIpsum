const MongoClient = require('mongodb').MongoClient;

const uri = "mongodb+srv://smoop:c30MNpjC4hCu1Gj0@clustername-uocwt.mongodb.net";

const client = new MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true});

var league = ["IRON", "BRONZE", "SILVER", "GOLD", "PLATINUM", "DIAMOND", "MASTER", "GRANDMASTER", "CHALLENGER"];

function checkDoubleGame(leag){
            
    const collection = client.db("GAME_ID").collection(leag);

    collection.find().toArray( (err, docs) => {
       if (err) {
           throw err;
        } 
        console.log('Array built successfuly');

        var double = 0;

        docs.forEach( (elem,index, array) => {
            //setTimeout( function() {
            array.forEach( (el, ind, arr) => {

                if(elem.gameId === el.gameId && index < ind){
                    double++;

                    console.log(double + ' -> Elem : ' + elem.gameId + ' & El : ' + el.gameId + ' ----- index 1 : ' + index + ' & index 2 : ' + ind);
                    try {
                        console.log(elem.gameId + ' deleted');
                        //CHECK OUTPUT BEFORE DELETING
                        collection.deleteOne( { "gameId" : elem.gameId } );
                    } catch (e) {
                       console.log(e);
                    }
                }
            });
            //}, index * 10);               
        });
    });
}



//START CLIENT
client.connect(err => {
    if (err) {
        console.log('Sorry unable to connect to MongoDB Error:', err);
    } else {
        console.log('Connected successfully to server', uri);

        league.forEach( (lg, i) => {
            setTimeout( function() {        
        
                checkDoubleGame(lg);
                
            }, i * 10000);
        });
    }
});