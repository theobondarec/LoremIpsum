import React, { Component } from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';
import logo from '../assets/logo.png';
import lol from '../assets/lol.jpg';


export default class Home extends Component {
    constructor (props){
        super(props)
    
        this.state = { 
            conseil:axios.get("http://localhost:8080/").then(response=>this.setState({conseil:response})),
            pseudo:"",
            champion:""
        }
    this.handleChangePseudo=this.handleChangePseudo.bind(this);
    this.handleChangeChampion=this.handleChangeChampion.bind(this)
    }

    handleChangeChampion(event){
        this.setState({champion:event.target.value})
    }
    handleChangePseudo(event){
        this.setState({pseudo:event.target.value})
    }


    render() { 
        let message = this.state.conseil.data;
        return (
            <div>
                <body style={{backgroundImage: "url(" + lol + ")", backgroundAttachment: "fixed", height: "100vh", width: "100vw"}}>
                    <div className = "row">
                        <div className = "col-8" style = {{ paddingLeft: 80 }}>
                            <img className = "w-75" src = {logo} alt="ISEN.gg" />
                            <p className = "display-1 text-light">Site de conseils pour s'améliorer à LoL</p>
                        </div>
                        <div className = "col-3">
                            <div className = "card text-white bg-dark mb-3" style = {{padding: 10}}>
                                <div className = "card-header">
                                    <p>Conseils par champion</p>
                                </div>
                                <form className="form-inline" >
                                    <div className="input-group">
                                        <input type="pseudo" className="form-control" placeholder="Pseudo" aria-label="pseudo" value={this.state.pseudo} onChange={this.handleChangePseudo} />
                                        <input type="champion" className="form-control" placeholder="Champion" aria-label="champion" value={this.state.champion} onChange={this.handleChangeChampion} />
                                        <div class="input-group-append">
                                                <Link to={"/Conseil/"+this.state.pseudo+"/"+this.state.champion} className = "btn btn-secondary text-white">
                                                    Search
                                                </Link>
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <div className = "card text-white bg-dark mb-3" style = {{paddingTop: 15, paddingLeft: 15, paddingRight: 15}}>
                                <p>{message}</p>
                            </div>
                        </div>
                    </div>
                </body>
            </div>
            
        );
    }
}
