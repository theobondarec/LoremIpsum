import React, { Component } from 'react';
import axios from 'axios';
import logo from './logo.png'
import lol from './lol.jpg'


export default class Home extends Component {
    constructor (props){
        super(props)
    
        this.state = { 
            conseil:axios.get("http://localhost:8080/").then(response=>this.setState({conseil:response.data}))
        }
        this.handleClick=this.handleClick.bind(this);
    }
    
    handleClick(event){
        console.log(this.state.conseil)
    }
    render() { 
        return (
            <div>
                <body style={{backgroundImage: "url(" + lol + ")", backgroundAttachment: "fixed", height: "100vh", width: "100vw"}}>
                    <div className = "row">
                        <div className = "col-7" style = {{ paddingLeft: 80 }}>
                            <img className = "w-75" src = {logo} alt="ISEN.gg" />
                            <p className = "display-1 text-light">Site de conseils pour s'améliorer à LoL</p>
                        </div>
                        <div className = "col-3">
                            <div className = "card text-white bg-dark mb-3">
                                <div className = "card-header">
                                    <a>Conseils par champion</a>
                                </div>
                                <div className="input-group">
                                    <input type="text" class="form-control" placeholder="Pseudo"/>
                                    <input type="text" class="form-control" placeholder="Champion"/>
                                    <div class="input-group-append">
                                        <button class="btn btn-secondary" type="button">Search</button>
                                    </div>
                                </div>
                            </div>
                            
                        </div>
                    </div>
                </body>
            </div>
            
        );
    }
}
