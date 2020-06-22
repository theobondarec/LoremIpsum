import React, { Component } from 'react';
import conseil_joueur from './conseil_joueur';
import axios from 'axios';
import {Link} from 'react-router-dom';


class Conseil extends Component {
    constructor(props){
        super(props)
    this.handleChangePseudo=this.handleChangePseudo.bind(this);
    this.handleChangeChampion=this.handleChangeChampion.bind(this)
    }
    state = { 
        pseudo:"",
        champion:"",
        champions:require('../assets/champ.json')
    }
    handleChangeChampion(event){
        this.setState({champion:event.target.value})
    }
    handleChangePseudo(event){
        this.setState({pseudo:event.target.value})
    }
    


    render() { 
        return (
            <div>
                <div >
                    <nav className="navbar navbar-light bg-light">
                        <form className="form-inline" >
                            <input  className="form-control mr-sm-2" type="pseudo" placeholder="Pseudo" aria-label="Pseudo" value={this.state.pseudo} onChange={this.handleChangePseudo}/>
                            <input  className="form-control mr-sm-2" type="champion" placeholder="champion" aria-label="Pseudo" value={this.state.champion} onChange={this.handleChangeChampion}/>
                            <Link to={"/Conseil/"+this.state.pseudo+"/"+this.state.champion}>
                                Search
                            </Link>
                        </form>
                    </nav>
                </div>
            </div>
            );
    }
}

export default Conseil;
