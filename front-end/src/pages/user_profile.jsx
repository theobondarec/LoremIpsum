import React,{Component} from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';

class UserProfile extends Component {

    constructor(props){
        super (props);
        this.state = {
            champions: require('../assets/champ.json'),
            infos: axios.get("http://localhost:8080"+this.props.match.url)
            .then(response => {
                this.setState({ infos:response.data }); 
                this.setState({ gameInfos:response.data[0] });
            }),
            gameInfos: {},
            items: [],
            }
        
        this.handleChangePseudo=this.handleChangePseudo.bind(this);
        this.handleClick=this.handleClick.bind(this);
    }
    handleChangePseudo (event) {
        this.setState({ pseudo:event.target.value })
    }
    handleClick(event){
        console.log(this.state.infos.length)
        console.log(this.state.items.length)
    }     
    render() {
/*        this.setState({ 
            items: this.state.items.concat(this.state.infos[0])
        });
        const elements = ['one', 'two', 'three'];
        var i = 0;*/
        
        var items = [];
        
        for( var i = 0; i < this.state.infos.length/2; i++){
            items.push(i);
        }
        
        
        //Object.entries(this.state.infos).map(([key, value], index) => ( items.push(value)));
        
        
        return ( 
            <div class="container-fluid">
                <div>
                    <nav className="navbar navbar-light bg-light">
                        <form className="form-inline" >
                            <input  className="form-control mr-sm-2" type="pseudo" placeholder="Pseudo" aria-label="Pseudo" value={this.state.pseudo} onChange={this.handleChangePseudo}/>
                            <Link to={"/Profile/"+this.state.pseudo}>
                                Search
                            </Link>
                        </form>
                    </nav>
                </div>
                <div class="card-columns">
                        {Object.entries(this.state.infos).map(([key, value], index) => (
                            <div class="card mt-3 text-white bg-dark h-10">
                                <div class="card-title d-flex justify-content-center" style={{"margin-bottom": "0px"}}>
                                    <div><h5 style={{"font-size":"150%"}}>{this.state.infos[index].nameChamp}</h5></div>
                                </div>
                                <div class= "d-flex justify-content-center">
                                    <img class="card-img-top d-flex" src = {"http://ddragon.leagueoflegends.com/cdn/10.11.1/img/champion/"+this.state.infos[index].nameChamp+".png"}
                                        style={{width: "30%", "margin-bottom":"2%"}}
                                    />
                                </div>
                                <div class="card-title d-flex justify-content-between" style={{"padding-left": "2%","padding-right": "2%"}}>
                                    <div><h6>WinRate: {this.state.infos[index].win}%</h6></div>
                                    <div><h6>KDA: {this.state.infos[index].KDA} </h6></div>
                                </div>
                                <div class="card-body d-flex justify-content-between" style={{"padding-left":"2%","padding-top":"2%", "padding-bottom":"2%", "padding-right":"3%"}}>
                                    <div><p>Vision score:  {this.state.infos[index].visionScore}</p></div>
                                    <div><p>Minion Killed: {this.state.infos[index].totalMinionKilled}</p></div>
                                    <div><p>Game Played: {this.state.infos[index].gamePlayed}</p></div>
                                </div>
                            </div>
                        ))}
                </div>  
            </div>
            
        );
    }
}

export default UserProfile;