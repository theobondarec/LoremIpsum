import Champion from './champion';
import React, { Component } from 'react';
class tableauChampion extends Component {
    state = {
        champions:require('./champ.json')
    }
    render() { 
        return (
            <div style={{marginTop: 20}}>
                <div className="container">
                    <div className="row">
                        {this.state.champions.map(champion=>
                            <Champion key={champion.id} champion={champion} />)}
                    </div>
                </div>
            </div>
        );
    }
}

export default tableauChampion;
