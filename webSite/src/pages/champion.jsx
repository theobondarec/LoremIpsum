import React,{Component} from 'react';
import {Link} from 'react-router-dom';

class Champion extends Component {
    state = {
        //props= champion passé en props par le composant tableauChampion récupération des infos
        Url:this.props.champion.icon,
        id:this.props.champion.name,
        name:this.props.champion.name,
    };

    render() { 
        return ( 
            <div className = "card bg-white mb-3">
                <Link to={'/Champion/' + this.state.id}>
                <img src={this.state.Url} alt={this.state.name}/>
                <h1 style={{color: 'black', fontSize:15, textAlign: 'center', marginTop: 10} }>{this.state.name}</h1>
                </Link>
            </div>
        )
    }
}

export default Champion;