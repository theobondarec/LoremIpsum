import React, { Component } from 'react';

class conseil_joueur extends Component {
    constructor(props){
        super (props);
        this.state = {
        id:this.props
        }
    }
    render() { 
        return ( 
            <h1>
                {this.state.id}
            </h1>
         );
    }
}
 
export default conseil_joueur