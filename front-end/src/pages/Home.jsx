import React, { Component } from 'react';
import axios from 'axios';


export default class Home extends Component {
    constructor (props){
        super(props)
    
        this.state = { 
            conseil:axios.get("http://localhost:8080/").then(response=>this.setState({conseil:response.data}))
        }
    }
    this.handleClick=this.handleClick.bind(this);
    handleClick(event){
        console.log(this.state.conseil)
    }
    render() { 
        return (
            <div className="container">
                <h1 style={{color:"Red"}}>HOME PAGE</h1>
                <p style={{color:"black"}}>Welcome to ISEN.gg the fastest way to reach challenger</p>
            </div>
        );
    }
}
