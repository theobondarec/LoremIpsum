const MongoClient = require('mongodb').MongoClient;

const uri = "mongodb+srv://smoop:c30MNpjC4hCu1Gj0@clustername-uocwt.mongodb.net";

const client = new MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true});

var loc = [
    ["IRON", "I", "II", "III", "IV"],
    ["BRONZE", "I", "II", "III", "IV"],
    ["SILVER", "I", "II", "III", "IV"],
    ["GOLD", "I", "II", "III", "IV"],
    ["PLATINUM", "I", "II", "III", "IV"],
    ["DIAMOND", "I", "II", "III", "IV"],
    ["MASTER", "I"],  
    ["GRANDMASTER", "I"],
    ["CHALLENGER", "I"]
];


function checkDouble(){
    
    loc.forEach( (e, i, a) => {
        loc[i].forEach( (ee, ii, aa) => {
        
            if(ii>0){
                console.log(a[i][0] + ' ' + ee);  
                
                const collection = client.db(a[i][0]).collection(ee);

                collection.find().toArray( (err, docs) => {
                   if (err) {
                       throw err;
                    } 
                    console.log('Array built successfuly');

                    var double = 0;

                    docs.forEach( (elem,index, array) => {
                        array.forEach( (el, ind, arr) => {

                            if(elem.name === el.name && index < ind){
                                double++;
                                console.log(double + ' -> Elem : ' + elem.name + ' & El : ' + el.name + ' ----- index 1 : ' + index + ' & index 2 : ' + ind);
                                try {
                                    console.log(elem.name + ' deleted');
                                    collection.deleteOne( { "name" : elem.name } );
                                } catch (e) {
                                   console.log(e);
                                }
                            }
                        });
                    });
                });
            }
        });
    });
}





//START CLIENT
client.connect(err => {
    if (err) {
        console.log('Sorry unable to connect to MongoDB Error:', err);
    } else {
        console.log('Connected successfully to server', uri);
        
        checkDouble();

    }
});