import React,{Component} from 'react';
import {Link} from 'react-router-dom';

class Champion extends Component {
    state = {
        Url:this.props.champion.icon,
        id:this.props.champion.name,
        name:this.props.champion.name,
        hp:this.props.champion.stats.hp,
        mp:this.props.champion.stats.mp,
        movespeed:this.props.champion.stats.movespeed,
        armor:this.props.champion.stats.armor,
        attackrange:this.props.champion.stats.attackrange,
        hpregen:this.props.champion.stats.hpregen,
        mpregen:this.props.champion.stats.mpregen,
        crit:this.props.champion.stats.crit,
        attackdamage:this.props.champion.stats.attackdamage,
        attackspeed:this.props.champion.stats.attackspeed,

    };
    handleSelection = id =>{
        console.log(id,this)
    }
    
    render() { 
        return ( 
        <div >
            <Link to={'/Champion/' + this.state.id}>
            <img src={this.state.Url} alt={this.state.name}/>
            <h1 style={{color: 'white', fontSize:15, textAlign: 'center', marginTop: 10} }>{this.state.name}</h1>
            </Link>
        </div>
        )
    }
}

export default Champion;