import React, { Component } from 'react';

class championInfo extends Component {
    constructor(props){
        super (props);
    this.state = {
        champions:require('./champ.json').filter(c=> c.name ===this.props.match.params.id),
        }   
    }
    render() { 
        return (  
            <div className="container" style={{marginTop: 20}}>
                <div className="row">
                    <div className="col-2 ml-4">
                        <div class = "card text-white text-center bg-dark mb-3" style={{width: 200}}>
                            <img src={this.state.champions[0].icon} class="rounded mx-auto d-block" alt= {this.state.champions[0].name} style={{marginTop: 40,width: 120, height: 120, }}/>
                            <div class="card-body">
                                <h1 class="card-title">
                                    {this.state.champions[0].name}
                                    <h5>{this.state.champions[0].title}</h5>
                                </h1>
                            </div>
                        </div>
                        <div class = "card text-white bg-dark mb-3" style={{width: 200}}>
                            <div class="card-body">
                                <h2 class="card-title">Base Stats</h2>
                                <p>HP : {this.state.champions[0].stats.hp}</p>
                                <p>MP : {this.state.champions[0].stats.mp}</p>
                                <p>Armor : {this.state.champions[0].stats.armor}</p>
                                <p>Attack Range : {this.state.champions[0].stats.attackrange}</p>
                                <p>Attack Damage : {this.state.champions[0].stats.attackdamage}</p>
                                <p>Attack Speed : {this.state.champions[0].stats.crit}</p>
                                <p>Move Speed : {this.state.champions[0].stats.movespeed}</p>
                                <p>HP Regen : {this.state.champions[0].stats.hpregen}</p>
                                <p>MP Regen : {this.state.champions[0].stats.mpregen}</p>
                            </div>
                        </div>
                    </div>
                    <div className="col" style={{marginLeft: 40}}>
                        <main>
                            
                        </main>
                    </div>
                </div>
            </div>
            
        );
    }
}

export default championInfo;
/*
<div class="row row-cols-4">
                        <div class="col">HP:{this.state.champions[0].stats.hp}</div>
                        <div class="col">HP PER LEVEL:{this.state.champions[0].stats.hpperlevel}</div>
                        <div class="col">Armor:{this.state.champions[0].stats.armor}</div>
                        <div class="col">movement speed:{this.state.champions[0].stats.movespeed}</div>
                    </div>*/