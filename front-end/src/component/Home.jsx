import React, { Component } from 'react';
import Lol from './lol.jpg';
import axios from 'axios';


class Home extends Component {
    constructor (props){
        super(props)
    
        this.state = { 
            conseil:axios.get("http://localhost:8080/").then(response=>this.setState({conseil:response.data}))
        }
        this.styles={
            background:{
            backgroundImage: "url("+Lol+")", 
            width:"100%",
            height:"400px%",
            backgroundSize: "cover",
            nackgroundPosition: "center",
        }
        }
    this.handleClick=this.handleClick.bind(this)
    };
    handleClick(event){
        console.log(this.state.conseil)
    }
    render() { 
        return (
            <body style={this.styles.background} >
                <div className="container"  >
                    <h1 style={{color:"Red"}}>
                        HOME PAGE
                    </h1>
                    <p style={{color:"black"}}>
                        Welcome to ISEN.gg the fastest way to reach challenger
                    </p>
                    <button onClick={this.handleClick}>
                        CLICKKKKKKKKKK
                    </button>
                </div>
            </body>
         );
    }
}
 
export default Home;