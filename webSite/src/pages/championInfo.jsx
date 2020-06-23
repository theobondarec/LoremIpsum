import React, { Component } from 'react';
import axios from 'axios';

class championInfo extends Component {
    constructor(props){
        //props: récupération du nom de champion dans l'url
        super (props);
    this.state = {
        champions: require('../assets/champ.json').filter(c => c.name === this.props.match.params.id),
        infos: axios.get("http://localhost:8080/champion/" + this.props.match.params.id + "/IRON").then(response => { this.setState({ infos:response.data }) }),
        league: "IRON",

        }
    this.handleChange = this.handleChange.bind(this);

    }
    handleChange(event){
        this.setState({ league:event.target.value })
        this.setState({ infos:axios.get("http://localhost:8080/champion/" + this.props.match.params.id + "/"+event.target.value).then(response => { this.setState({ infos:response.data }) }) })

    }
    render() { 
        return (  
            <div className = "container" style = {{ marginTop: 20 }}>
                <div className = "row">
                    <div className = "col-2 ml-4">
                        <div className = "card text-white text-center bg-dark mb-3" style = {{ width: 200 }}>
                            <img src = { this.state.champions[0].icon } className = "rounded mx-auto d-block" alt = { this.state.champions[0].name } style = {{marginTop: 40,width: 120, height: 120 }}/>
                            <div className = "card-body">
                                <h4 className = "card-head">
                                    { this.state.champions[0].name }
                                    <h5 style = {{ paddingTop : 20 }}>{ this.state.champions[0].title }</h5>
                                </h4>
                            </div>
                        </div>
                        <form>
                            <select value = { this.state.league } onChange = { this.handleChange } className = "btn btn-secondary dropdown-toggle bg-dark">
                                <option value = "IRON">IRON</option>
                                <option value = "BRONZE">BRONZE</option>
                                <option value = "SILVER">SILVER</option>
                                <option value = "GOLD">GOLD</option>
                                <option value = "PLATINUM">PLATINIUM</option>
                                <option value = "DIAMOND">DIAMOND</option>
                                <option value = "MASTER">MASTER</option>
                                <option value = "GRANDMASTER">GRANDMASTER</option>
                                <option value = "CHALLENGER">CHALLENGER</option>
                            </select>
                        </form> 
                        <div className = "card text-white bg-dark mb-3" style = {{ width: 200, marginTop:20 }}>
                            <div className = "card-body">
                                <h2 className = "card-title">Base Stats</h2>
                                <p>HP : { this.state.champions[0].stats.hp }</p>
                                <p>MP : { this.state.champions[0].stats.mp }</p>
                                <p>Armor : { this.state.champions[0].stats.armor }</p>
                                <p>Attack Range : { this.state.champions[0].stats.attackrange }</p>
                                <p>Attack Damage : { this.state.champions[0].stats.attackdamage }</p>
                                <p>Attack Speed : { this.state.champions[0].stats.crit }</p>
                                <p>Move Speed : { this.state.champions[0].stats.movespeed }</p>
                                <p>HP Regen : { this.state.champions[0].stats.hpregen }</p>
                                <p>MP Regen : { this.state.champions[0].stats.mpregen }</p>
                            </div>
                        </div>
                    </div>
                    <div className = "col" style = {{ marginLeft: 40 }}>
                        <main>                            
                            <div className = "container mt-3">
                                <div className = "card bg-dark text-white">
                                    <table className = "table table-dark" >
                                        <thead>
                                            <tr>
                                                <th scope = "col">Winrate</th>
                                                <th scope = "col">Average Kill Participation</th>
                                                <th scope = "col">Average Total Damage Dealt</th>
                                                <th scope = "col">Average KDA</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>{ this.state.infos.win}%</td>
                                                <td>{ this.state.infos.killParticipation }</td>
                                                <td>{ this.state.infos.totalDamageDealt }</td>
                                                <td>{ this.state.infos.kill } / { this.state.infos.death } / { this.state.infos.assists }</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>                 
                            <div className = "container mt-3">
                                <div className = "card bg-dark text-white">
                                    <h4 style = {{ marginLeft: 10 }}>Pick rate by role</h4>
                                    <table className = "table table-dark" >
                                        <thead>
                                            <tr>
                                                <th scope = "col">TOP</th>
                                                <th scope = "col">JNG</th>
                                                <th scope = "col">MID</th>
                                                <th scope = "col">ADC</th>
                                                <th scope = "col">SUP</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>{ this.state.infos.top }%</td>
                                                <td>{ this.state.infos.jungle }%</td>
                                                <td>{ this.state.infos.mid }%</td>
                                                <td>{ this.state.infos.adc }%</td>
                                                <td>{ this.state.infos.support }%</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className = "container mt-3">
                                <div className = "card bg-dark text-white">
                                    <table className = "table table-dark" >
                                        <thead>
                                            <tr>
                                                <th scope = "col">Average Minions Killed</th>
                                                <th scope = "col">Average Gold Earned</th>
                                                <th scope = "col">Average Vision Score</th>
                                                <th scope = "col">Average Game Time</th>                                            
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>{ this.state.infos.totalMinionKilled }</td>
                                                <td>{ this.state.infos.goldEarned }</td>
                                                <td>{ this.state.infos.visionScore }</td>
                                                <td>{ this.state.infos.gameDuration }</td>                                           
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </main>
                    </div>
                </div>
            </div>
            
        );
    }
}

export default championInfo;
