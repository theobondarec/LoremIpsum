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
/*
<nav className="navbar navbar-light bg-light navbar-fixed-top" style = {{marginTop: 65}}>
    <form className="form-inline">
        <input className="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search"/>
        <button className="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
    </form>
</nav>
*/