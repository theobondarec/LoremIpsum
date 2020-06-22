const MongoClient = require('mongodb').MongoClient;

const uri = "mongodb+srv://smoop:c30MNpjC4hCu1Gj0@clustername-uocwt.mongodb.net";

const client = new MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true});

var loca = [
    ["IRON", "I", "II", "III", "IV"],
    ["BRONZE", "I", "II", "III", "IV"],
    ["SILVER", "I", "II", "III", "IV"],
    ["GOLD", "I", "II", "III", "IV"],
    ["PLATINUM", "I", "II", "III", "IV"],
    ["DIAMOND", "I", "II", "III", "IV"],
    ["MASTER", "I"],  
    ["GRANDMASERT", "I"],
    ["CHALLENGER", "I"]
];


//START CLIENT
client.connect(err => {
    if (err) {
        console.log('Sorry unable to connect to MongoDB Error:', err);
    } else {
        console.log('Connected successfully to server', uri);
        
        loca.forEach( (e, i, a) => {
            loca[i].forEach( (ee, ii, aa) => {

                if(ii>0){
                    console.log(a[i][0] + ' ' + ee);  

                    const collection = client.db(a[i][0]).collection(ee);

                    collection.drop();

                    console.log('Db clear');
                }
            });
        });
        
    }
});