import React, { Component } from 'react';
import Lol from './lol.jpg'



class Home extends Component {
    state = {  }
    styles={
        background:{
        backgroundImage: "url("+Lol+")", 
        width:"100%",
        height:"400px%",
        backgroundSize: "cover",
        nackgroundPosition: "center",
    }

    };
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
                </div>
            </body>
         );
    }
}
 
export default Home;