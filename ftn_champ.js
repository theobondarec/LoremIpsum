
var Champ = {
    "_id":{
        "$oid":"5ede2b8c0a9f2aa75506586c"
    },
    "idChampion":"1",
    "nomChampion":"olaf",
    "stats":{
        "gamePlayed":"100",
        "loose":"50",
        "win":"50",
        "ban":"10",
        "gameDuration":"100000",
        "assists":"90",
        "kill":"40",
        "death":"30",
        "totalDamageDealt":"10000",
        "visionScore":"300",
        "goldEarned":"1000000000000000",
        "totalMinionKilled":"20000",
        "visionWardsBoughtInGame":"200",
        "totalTimeCrowdControlDealt":"2000000000000000"
    },
    "lane":{
        "mid":"2",
        "jungle":"60",
        "top":"30",
        "support":"2",
        "adc":"6"
    }
};

// Fonction secondes -> minutes
function conversion_seconde_heure(time) {
    var reste=time;
    var result='';

    var nbJours=Math.floor(reste/(3600*24));
    reste -= nbJours*24*3600;

    var nbHours=Math.floor(reste/3600);
    reste -= nbHours*3600;

    var nbMinutes=Math.floor(reste/60);
    reste -= nbMinutes*60;

    var nbSeconds=reste;

    if (nbJours>0)
        result=result+nbJours+'j ';

    if (nbHours>0)
        result=result+nbHours+'h ';

    if (nbMinutes>0)
        result=result+nbMinutes+'min ';

    if (nbSeconds>0)
        result=result+nbSeconds+'s ';

    return result;
}
var temps = conversion_seconde_heure(Champ.stats.gameDuration)

// Fonction calculant le winrate
function winrate(){
    var win = Champ.stats.gamePlayed*Champ.stats.win/100 + "%";
    return  win
}
var winrate = winrate()

// Fonction calculant le nombre d'assists moyen par partie
function assistsrate(){
    var assist = Champ.stats.assists/Champ.stats.gamePlayed
    return  Math.round(assist*100)/100;
}
var assistsrate = assistsrate()

// Fonction calculant le nombre de kills moyen par partie
function killrate(){
    var kills = Champ.stats.kill/Champ.stats.gamePlayed
    return  Math.round(kills*100)/100;
}
var killratio = killrate()

// Fonction calculant le nombre de mort par partie
function deathrate(){
    var deaths = Champ.stats.death/Champ.stats.gamePlayed
    return  Math.round(deaths*100)/100;
}
var deathratio = deathrate()

// Fonction calculant le nombre de kills par mort
function k_d(){
    var kill_death = Champ.stats.kill/Champ.stats.death
    return  Math.round(kill_death*100)/100;
}
var ki_de = k_d()

// Fonction calculant le nombre degats moyen par game 
function degats_moyen(){
    var degats = Champ.stats.totalDamageDealt/Champ.stats.gamePlayed
    return Math.round(degats*100)/100;
}
var deg_game = degats_moyen()

// Fonction calculant le score de vision moyen par game 
function score_vision(){
    var vision = Champ.stats.visionScore/Champ.stats.gamePlayed
    return Math.round(vision*100)/100;
}
var vison_game = score_vision()

// Fonction calculant le nombre moyen de gold accumulé par game 
function gold_moyen(){
    var gold = Champ.stats.goldEarned/Champ.stats.gamePlayed
    return Math.round(gold*100)/100;
}
var gold_game = gold_moyen()

// Fonction calculant le nombre moyen de minoin tués par game 
function minion_moyen(){
    var minion = Champ.stats.totalMinionKilled/Champ.stats.gamePlayed
    return Math.round(minion*100)/100;
}
var minion_game = minion_moyen()

// Fonction calculant le nombre moyen de wards achetés par game 
function ward_moyen(){
    var ward = Champ.stats.visionWardsBoughtInGame/Champ.stats.gamePlayed
    return Math.round(ward*100)/100;
}
var ward_game = ward_moyen()

// Fonction calculant le nombre moyen de points de crowd controlé par game 
function crowd_control_moyen(){
    var crowd = Champ.stats.totalTimeCrowdControlDealt/Champ.stats.gamePlayed
    return Math.round(crowd*100)/100;
}
var crowd_game = crowd_control_moyen()

// Fonction donnant les lanes les plus utilisés
function lane_pref(){
    const byValue = (a,b) => b - a // constante défini pour trier les valeurs du tableaux par ordre décroissant
    var lane = [Champ.lane.jungle,Champ.lane.mid,Champ.lane.adc,Champ.lane.support,Champ.lane.top]
    var lane_sorted = [...lane].sort(byValue) // tri des valeurs pour les lane
    var lane_choisi =[]
    
    // test pour retourner les noms des lanes et pas les chiffres des lanes
    if (Champ.lane.jungle==lane_sorted[0]){
        lane_choisi[0] = "jungle"
        if(Champ.lane.mid==lane_sorted[1]){
            lane_choisi[1] = "mid"
        }
        else if(Champ.lane.adc==lane_sorted[1]){
            lane_choisi[1] = "adc"
        }
        else if(Champ.lane.support==lane_sorted[1]){
            lane_choisi[1] = "support"
        }
        else if(Champ.lane.top==lane_sorted[1]){
            lane_choisi[1] = "top"
        }
    }
    else if(Champ.lane.mid==lane_sorted[0]){
        lane_choisi[0] = "mid"
        if(Champ.lane.jungle==lane_sorted[1]){
            lane_choisi[1] = "jungle"
        }
        else if(Champ.lane.adc==lane_sorted[1]){
            lane_choisi[1] = "adc"
        }
        else if(Champ.lane.support==lane_sorted[1]){
            lane_choisi[1] = "support"
        }
        else if(Champ.lane.top==lane_sorted[1]){
            lane_choisi[1] = "top"
        }
    }
    else if(Champ.lane.adc==lane_sorted[0]){
        lane_choisi[0] = "adc"
        if(Champ.lane.mid==lane_sorted[1]){
            lane_choisi[1] = "mid"
        }
        else if(Champ.lane.jungle==lane_sorted[1]){
            lane_choisi[1] = "jungle"
        }
        else if(Champ.lane.support==lane_sorted[1]){
            lane_choisi[1] = "support"
        }
        else if(Champ.lane.top==lane_sorted[1]){
            lane_choisi[1] = "top"
        }
    }
    else if(Champ.lane.support==lane_sorted[0]){
        lane_choisi[0] = "support"
        if(Champ.lane.mid==lane_sorted[1]){
            lane_choisi[1] = "mid"
        }
        else if(Champ.lane.adc==lane_sorted[1]){
            lane_choisi[1] = "adc"
        }
        else if(Champ.lane.jungle==lane_sorted[1]){
            lane_choisi[1] = "jungle"
        }
        else if(Champ.lane.top==lane_sorted[1]){
            lane_choisi[1] = "top"
        }
    }
    else if(Champ.lane.top==lane_sorted[0]){
        lane_choisi[0] = "top"
        if(Champ.lane.mid==lane_sorted[1]){
            lane_choisi[1] = "mid"
        }
        else if(Champ.lane.adc==lane_sorted[1]){
            lane_choisi[1] = "adc"
        }
        else if(Champ.lane.support==lane_sorted[1]){
            lane_choisi[1] = "support"
        }
        else if(Champ.lane.jungle==lane_sorted[1]){
            lane_choisi[1] = "jungle"
        }
    }
    return lane_choisi
}
var lane_game = lane_pref()

// Fonction triant les champs selon leur hp (à diversifier)
function tri_hp(tab){
    for (i=0;i<148;i++){
        tab[i] = { name: champions[i].name, value: champions[i].stats.hp }
    }
    tab.sort(function (a, b) {
        return b.value - a.value;
    });
    return tab;  
}
