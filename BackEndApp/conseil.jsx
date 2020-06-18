import React, { Component } from 'react';
import conseil_joueur from './conseil_joueur';
import axios from 'axios';
class Conseil extends Component {
    constructor(props){
        super(props)
    this.handleChange=this.handleChange.bind(this);
    this.handleClick=this.handleClick.bind(this);
    }
    state = { 
        pseudo:"apo wallss",
        champion:"",
        infos:{}
    }
    handleChange(event){
        this.setState({pseudo:event.target.value})
    }

    handleClick(event){
        axios.get("http://localhost:8080/Conseil/apo wallss/Alistar").then(response=>{this.setState({infos:response})})
        console.log(this.state.infos)
    }

    render() { 
        return (
            <div>
                <div >
                    <nav className="navbar navbar-light bg-light">
                        <form className="form-inline" onSubmit={this.handleSubmit}>
                            <input  className="form-control mr-sm-2" type="pseudo" placeholder="Pseudo" aria-label="Pseudo" value={this.state.search} onChange={this.handleChange}/>
                        </form>
                    </nav>
                </div>
                <button className="button" onClick={this.handleClick}> 
                    CLICKKKKKKKKKKKKKKKKKKKKK
                </button>
            </div>
            );
    }
}
 
export default Conseil;
