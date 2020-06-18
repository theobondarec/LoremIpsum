import React, { Component } from 'react';
import {Link} from 'react-router-dom'
import Logo from "./Logo.jpg"

class NavBar extends Component {
    state = {  }
    render() { 
        return ( 
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <h3>
                <img src={Logo} alt="logo" width="40% \9" />
            </h3>
            <ul>
                <Link to='/'>
                    <li className="btn btn-outline-success">Home</li>
                </Link>
                <Link to='/Champion'>
                    <li className="btn btn-sm btn-outline-secondary">Champion Pages</li>
                </Link>
                <Link to='/Conseil'>
                    <li className="btn btn-sm btn-outline-secondary">Conseil</li>
                </Link>
            </ul>
        </nav>
            );
    }
}
 
export default NavBar;