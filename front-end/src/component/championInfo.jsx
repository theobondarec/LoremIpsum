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
                        <div class = "card" style={{color: 'd5d5d5', width: 200}}>
                            <img src={this.state.champions[0].icon} class="rounded mx-auto d-block" alt= {this.state.champions[0].name} style={{width: 120, height: 120, }}/>
                            <div class="card-body">
                                <h1 class="card-title">
                                    {this.state.champions[0].name}
                                    <h5>{this.state.champions[0].title}</h5>
                                </h1>
                            </div>
                            
                        </div>
                    </div>
                    <div className="col">
                        
                    </div>
                </div>
            <main>
                <div class="container mt-4">
                <table class="table table-dark" >
                    <thead>
                        <tr>
                            <th scope="col">HP</th>
                            <th scope="col">HP PER LEVEL</th>
                            <th scope="col">Armor</th>
                            <th scope="col">Movement speed</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <th scope="row">{this.state.champions[0].stats.hp}</th>
                            <td>{this.state.champions[0].stats.hpperlevel}</td>
                            <td>{this.state.champions[0].stats.armor}</td>
                            <td>{this.state.champions[0].stats.movespeed}</td>
                        </tr>
                    </tbody>
                
                </table>
                </div>
                <div className = "row">
                    <div className = "col"><a>Placeholder</a></div >
                    <div className = "col-8"><a>Placeholder for other stats</a></div >
                    <div className = "col"><a>Placeholder</a></div >
                </div>
            </main>
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