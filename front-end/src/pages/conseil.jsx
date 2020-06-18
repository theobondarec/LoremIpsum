import React, { Component } from 'react';
import conseil_joueur from './conseil_joueur';
import axios from 'axios';


class Conseil extends Component {
    constructor(props){
        super(props)
    this.handleChangePseudo=this.handleChangePseudo.bind(this);
    this.handleChangeChampion=this.handleChangeChampion.bind(this)
    this.handleClick=this.handleClick.bind(this);
    }
    state = { 
        pseudo:"",
        champion:"",
        infos:{}
    }
    handleChangeChampion(event){
        this.setState({champion:event.target.value})
    }
    handleChangePseudo(event){
        this.setState({pseudo:event.target.value})
    }

    handleClick(event){
        event.preventDefault();
        //axios.get("http://localhost:8080/Conseil/"+this.state.pseudo+"/"+this.state.champion).then(response=>{this.setState({infos:response})})
        axios.get("http://localhost:8080/Conseil/"+this.state.pseudo+"/"+this.state.champion).then(function(response){console.log(response)})
        console.log(this.state.infos)
    }

    render() { 
        return (
            <div>
                <div >
                    <nav className="navbar navbar-light bg-light">
                        <form className="form-inline" onSubmit={this.handleClick}>
                            <input  className="form-control mr-sm-2" type="pseudo" placeholder="Pseudo" aria-label="Pseudo" value={this.state.pseudo} onChange={this.handleChangePseudo}/>
                            <input  className="form-control mr-sm-2" type="champion" placeholder="champion" aria-label="Pseudo" value={this.state.champion} onChange={this.handleChangeChampion}/>
                            <button className="btn btn-outline-success my-2 my-sm-0" onClick={this.handleClick}> Search</button>
                        </form>
                    </nav>
                    <body>                   
                        <div className="container mt-3">
                            <table className="table table-dark" >
                                <thead>
                                    <tr>
                                        <th scope="col">Winrate</th>
                                        <th scope="col">Kill Participation</th>
                                        <th scope="col">totalMinionKilled</th>
                                        <th scope="col">kill</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <th scope="row">{this.state.infos.win}</th>
                                        <td>{this.state.infos.killParticipation}</td>
                                        <td>{this.state.infos.totalMinionKilled}</td>
                                        <td>{this.state.infos.kill}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>                        
                    </body>
                </div>
            </div>
            );
    }
}
 
export default Conseil;
