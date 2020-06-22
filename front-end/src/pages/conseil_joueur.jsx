import React, { Component } from 'react';
import axios from 'axios'
import RadarChart from 'react-svg-radar-chart';
import 'react-svg-radar-chart/build/css/index.css';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import banner from "../assets/lol-maintenance.png";



class conseil_joueur extends Component {
    constructor(props){
        super (props);
        this.state = {
            search:"IRON",
            champion:require('../assets/champ.json').filter(c=> c.name ===this.props.match.params.champion),
            pseudos:this.props.match.params.pseudo,
            notes:axios.get("http://localhost:8080"+this.props.match.url).then(response=>{this.setState({notes:response.data.notesTab}); this.setState({PlayerStats:response.data.statsTab.playerStatsAll});this.setState({LigueStats:response.data.statsTab})}),
            PlayerStats:{},
            LigueStats:{},
            ChampionStats:axios.get("http://localhost:8080/champion/"+this.props.match.params.champion+"/IRON").then(response=>{this.setState({ChampionStats:response.data})}),

        }
        this.captions={
            Damage:'Damage',
            Farm:'Farm',
            Golds:'Golds',
            Vision:'Vision',
            killParticipation:'kill participation'
        };
        this.handleClick=this.handleClick.bind(this);
        this.handleChange=this.handleChange.bind(this);
    }
    handleChange(event){
        this.setState({search:event.target.value})
        this.setState({infos:axios.get("http://localhost:8080/champion/"+this.props.match.params.champion+"/"+event.target.value).then(response=>{this.setState({ChampionStats:response.data})})})

    }
    
    handleClick(event){
        //utilité pour debug créer button utilisant handleClick
        console.log(this.state.ChampionStats)
        console.log(this.state.notes)
        console.log(this.state.PlayerStats)
        console.log(this.state.LigueStats)
    }
    render() { 
        var role=""
        if(this.state.PlayerStats.support>this.state.PlayerStats.mid && this.state.PlayerStats.support>this.state.PlayerStats.jungle && this.state.PlayerStats.support>this.state.PlayerStats.top && this.state.PlayerStats.support>this.state.PlayerStats.adc){
            role="support"
        }
        if(this.state.PlayerStats.adc>this.state.PlayerStats.mid && this.state.PlayerStats.adc>this.state.PlayerStats.jungle && this.state.PlayerStats.adc>this.state.PlayerStats.top && this.state.PlayerStats.adc>this.state.PlayerStats.support){
            role="bot"
        }
        if(this.state.PlayerStats.mid>this.state.PlayerStats.support && this.state.PlayerStats.mid>this.state.PlayerStats.jungle && this.state.PlayerStats.mid>this.state.PlayerStats.top && this.state.PlayerStats.mid>this.state.PlayerStats.adc){
            role="mid"
        }
        if(this.state.PlayerStats.jungle>this.state.PlayerStats.mid && this.state.PlayerStats.jungle>this.state.PlayerStats.support && this.state.PlayerStats.jungle>this.state.PlayerStats.top && this.state.PlayerStats.jungle>this.state.PlayerStats.adc){
            role="jungle"
        }
        if(this.state.PlayerStats.top>this.state.PlayerStats.mid && this.state.PlayerStats.top>this.state.PlayerStats.jungle && this.state.PlayerStats.top>this.state.PlayerStats.support && this.state.PlayerStats.top>this.state.PlayerStats.adc){
            role="top"
        }
        return (
            <div className="container-fluid" style={{marginTop: 20}}>
                <div className="row">
                    <div className="col-2">
                        <div className = "card text-white text-center bg-dark mb-3" style={{width: 200}}>
                            <img src={this.state.champion[0].icon} className="rounded mx-auto d-block" alt= {"champion"} style={{marginTop: 40,width: 120, height: 120, }}/>
                            <div className="card-body">
                                <h2 className="card-title">
                                    {this.state.pseudos}
                                    <p className="h5">{this.state.PlayerStats.ligue}</p>
                                    <p className="h5">{this.state.PlayerStats.win}%</p>
                                </h2>
                            </div>
                        </div> 
                        <div className = "card text-white bg-dark" style={{width: 200, marginTop:20}}>
                            <img src={"https://ultimate-bravery.net/images/roles/"+role+"_icon.png"} className="rounded mx-auto d-block"/>
                            <h3 className="card-title">{this.state.champion[0].tags[0]}</h3>
                            <h3 className="card-title">{this.state.champion[0].tags[1]}</h3>
                        </div>
                    </div>
                    <div className="col-5" style={{marginLeft: 40}}>
                        <img src={banner} alt={"header"} className="img-fluid"/>
                        <div position="center">
                            <p className="h5" position="center" className="h3">Analyse des performances</p>
                            <RadarChart captions={this.captions} data={[
                                            {
                                            data:{
                                                    Damage:(this.state.notes.Damage)/10,
                                                    Farm:(this.state.notes.Farm)/10,
                                                    Golds:(this.state.notes.Golds)/10,
                                                    Vision:(this.state.notes.Vision)/10,
                                                    killParticipation:(this.state.notes.killParticipation)/10,
                                                    },
                                                meta:{color:'red'},
                                                },
                                        ]} size={300} />
                        </div>
                        <h3> Conseil:</h3>
                        <body>
                            <p className="text" style={{whiteSpace:"pre-wrap"}}>
                                {this.state.LigueStats.advice}
                            </p>
                        </body>
                        <table className="table table-dark" >
                            <thead>
                                <tr>
                                    <th scope="col" className="h3">{this.state.pseudos}</th>
                                    <th scope="col" className="h3">Stats</th>
                                    <th scope="col" className="h3">moyenne en {this.state.search}</th>
                                </tr>
                            </thead>
                        </table>
                        <table className="table table-dark">
                            <thead>
                                <tr>
                                    <th scope="col" className="h3">Stats de combat</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td >{this.state.PlayerStats.assists}</td>
                                    <td >assists</td>
                                    <td >{this.state.ChampionStats.assists}</td>
                                </tr>
                                <tr>
                                    <td >{this.state.PlayerStats.kill}</td>
                                    <td >kills</td>
                                    <td >{this.state.ChampionStats.kill}</td>
                                </tr>
                                <tr>
                                    <td >{this.state.PlayerStats.assists/this.state.PlayerStats.death}</td>
                                    <td >KDA</td>
                                    <td >{(this.state.ChampionStats.kill+this.state.ChampionStats.assists)/this.state.ChampionStats.death}</td>
                                </tr>
                                <tr>
                                    <td >{this.state.PlayerStats.killParticipation}</td>
                                    <td >killParticipations</td>
                                    <td >{this.state.ChampionStats.killParticipation}</td>
                                </tr>
                                <tr>
                                    <td >{this.state.PlayerStats.totalDamageDealt}</td>
                                    <td >totalDamageDealts</td>
                                    <td >{this.state.ChampionStats.totalDamageDealt}</td>
                                </tr>
                                <tr>
                                    <td >{this.state.PlayerStats.totalDamageDealt/this.state.PlayerStats.gameDuration}</td>
                                    <td >DMG par min</td>
                                    <td >{this.state.ChampionStats.totalDamageDealt/this.state.ChampionStats.gameDuration}</td>
                                </tr>
                                <tr>
                                    <td>{this.state.PlayerStats.totalTimeCrowdControlDealt}</td>
                                    <td>totalTimeCrowdControlDeal</td>
                                    <td>{this.state.ChampionStats.totalTimeCrowdControlDealt}</td>
                                </tr>
                            </tbody>
                        </table>
                        <table className="table table-dark">
                            <thead>
                                <tr>
                                    <th scope="col" className="h3">Stats d'économie</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>{this.state.PlayerStats.totalMinionKilled}</td>
                                    <td>totalMinionKilled</td>
                                    <td>{this.state.ChampionStats.totalMinionKilled}</td>
                                </tr>
                                <tr>
                                    <td>{this.state.PlayerStats.totalMinionKilled/this.state.PlayerStats.gameDuration}</td>
                                    <td>cs/min</td>
                                    <td>{this.state.ChampionStats.totalMinionKilled/this.state.ChampionStats.gameDuration}</td>
                                </tr>
                            </tbody>
                        </table>
                        <table className="table table-dark" >
                            <thead>
                                <tr>                                    
                                    <th scope="col-4" className="h3">Stats de vision</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>{this.state.PlayerStats.visionScore}</td>
                                    <td>score de vision</td>
                                    <td>{this.state.ChampionStats.visionScore}</td>
                                </tr>
                            </tbody>                            
                                <tr>
                                    <td>{this.state.PlayerStats.visionWardsBoughtInGame}</td>
                                    <td>ward acheté</td>
                                    <td>{this.state.ChampionStats.visionWardsBoughtInGame}</td>
                                </tr>
                        </table>
                        
                    </div>
                    <div className="col-4">
                        <div className="row">
                            <div  >
                                <div className = "card text-white text-center bg-dark mb-3" style={{width: 200}}>
                                    <div className="card-body">
                                        <CircularProgressbar value={this.state.PlayerStats.win} text={this.state.PlayerStats.win+"%"}/>
                                        <h3 className="card-title">
                                            %victoire                                
                                        </h3>
                                    </div>
                                </div> 
                            </div>
                            <div style = {{ paddingLeft: 10 }} >
                                <div className = "card text-white text-center bg-dark mb-3" style={{width: 200}}>
                                    <div className="card-body">
                                        <CircularProgressbar value={100} text={this.state.PlayerStats.gamePlayed}/>
                                        <h3 className="card-title">
                                            jouées                               
                                        </h3>
                                    </div>
                                </div> 
                            </div>
                        </div>
                        <form >
                            <select value={this.state.league} onChange={this.handleChange} className="btn btn-secondary dropdown-toggle bg-dark">
                                    <option value="IRON">IRON</option>
                                    <option value="BRONZE">BRONZE</option>
                                    <option value="SILVER">SILVER</option>
                                    <option value="GOLD">GOLD</option>
                                    <option value="PLATINUM">PLATINIUM</option>
                                    <option value="DIAMOND">DIAMOND</option>
                                    <option value="MASTER">MASTER</option>
                                    <option value="GRANDMASTER">GRANDMASTER</option>
                                    <option value="CHALLENGER">CHALLENGER</option>
                                </select>
                        </form>
                    </div>
                </div>
            </div>
         );
    }
}
 
export default conseil_joueur