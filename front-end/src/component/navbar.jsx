import React, { Component } from 'react';
import {Link} from 'react-router-dom'

class NavBar extends Component {
    state = {  }
    render() { 
        return ( 
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark navbar-fixed-top">
            <h3>LOGO</h3>
            <ul>
                <Link to='/'>
                    <li className="btn btn-outline-success">Home</li>
                </Link>
                <Link to='/Champion'>
                    <li className="btn btn-sm btn-outline-secondary">Champion Pages</li>
                </Link>
                
            </ul>
        </nav>
            );
    }
}

export default NavBar;