import React,{Component} from 'react';
import {Link} from 'react-router-dom';

class Profile extends Component {
    constructor(props){
        super(props)
    this.handleChangePseudo=this.handleChangePseudo.bind(this);
    }
    state = { 
        pseudo:"",
    }
    handleChangePseudo (event) {
        this.setState({ pseudo:event.target.value })
    }

    render() { 
        return (
            <div>
                <div >
                    <nav className="navbar navbar-light bg-light">
                        <form className="form-inline" >
                            <input  className="form-control mr-sm-2" type="pseudo" placeholder="Pseudo" aria-label="Pseudo" value={this.state.pseudo} onChange={this.handleChangePseudo}/>
                            <Link to={"/Profile/"+this.state.pseudo}>
                                Search
                            </Link>
                        </form>
                    </nav>
                </div>
            </div>
            );
    }
}

export default Profile;