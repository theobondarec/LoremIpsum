var mongoose = require("mongoose");
const connection = require("C:\Users\xav10\Documents\Isen\Info\Projet2nd\connection")
//const deco = require("C:<_Users\xav10\Documents\Isen\Info\Projet2nd\decon")
//const save = require("C:<_Users\xav10\Documents\Isen\Info\Projet2nd\save")
//const modify = require("C:<_Users\xav10\Documents\Isen\Info\Projet2nd\save")
//const delete = require("C:<_Users\xav10\Documents\Isen\Info\Projet2nd\delete")
//const update = require("C:<_Users\xav10\Documents\Isen\Info\Projet2nd\update")


connection();

// Création du schéma
var championbronzeschema = new mongoose.Schema({
  nom : String,
  role : Array,
});

console.log('schema ajouté avec succès !');

// Création du Model
var ChampionBronzeModel = mongoose.model('Champion', championbronzeschema);

console.log('model ajouté avec succès !');

// On crée une instance du Model
var monChampion = new ChampionBronzeModel({ nom : 'Aatrox' });
monChampion.role = "jungler";
//monChampion.role = "top";
console.log('Champion instance ajouté avec succès !');

// On le sauvegarde dans MongoDB !
monChampion.save(function (err) {
  if (err) { throw err; }
  console.log('Champion ajouté avec succès !');
  // On se déconnecte de MongoDB maintenant
  mongoose.connection.close();
});
