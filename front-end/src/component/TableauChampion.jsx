import Champion from './champion';
import React, { Component } from 'react';
import Lol from "./lol.jpg"
import {Link} from 'react-router-dom'
class tableauChampion extends Component {
    constructor(props){
        super(props)
    this.handleChange=this.handleChange.bind(this);
    }
    state = {
        champions:require('./champ.json'),
        search:""
    }
    handleChange(event){
        this.setState({search:event.target.value})
    }
 
    render() { 
        return (
            <div className="container-fluid">
                    <nav className="navbar navbar-light bg-light">
                        <form className="form-inline">
                            <input  className="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search" value={this.state.search} onChange={this.handleChange}/>
                            <Link to={"/Champion/"+this.state.search} className="btn btn-outline-success my-2 my-sm-0">
                                search
                            </Link>
                        </form>
                    </nav>

                <div style={{marginTop: 20}}>
                    <div className="container">
                        <div className="row">
                            {this.state.champions.map(champion=><Champion key={champion.id} champion={champion} />)}
                        </div>
                    </div>
                </div>
            </div>
         );
    }
}
 
export default tableauChampion;