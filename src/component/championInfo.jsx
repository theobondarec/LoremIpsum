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
            <div className="container">
                <div className="row">
                    <div className="col-2">
                        <img src={this.state.champions[0].icon} alt="image" />
                    </div>
                    <div className="col">
                        <h1>
                        {this.state.champions[0].name}
                        <h5>{this.state.champions[0].title}</h5>
                        </h1>
                    </div>
                </div>
            <main>
                <div class="container">
                    <div class="row row-cols-4">
                        <div class="col">HP:{this.state.champions[0].stats.hp}</div>
                        <div class="col">HP PER LEVEL:{this.state.champions[0].stats.hpperlevel}</div>
                        <div class="col">Armor:{this.state.champions[0].stats.armor}</div>
                        <div class="col">movement speed:{this.state.champions[0].stats.movespeed}</div>
                    </div>
                </div>
            </main>
            </div>
                
        );
    }
}
 
export default championInfo;
