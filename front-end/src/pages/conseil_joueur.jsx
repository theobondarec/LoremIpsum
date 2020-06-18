import React, { Component } from 'react';
import axios from 'axios'
import RadarChart from 'react-svg-radar-chart';
import 'react-svg-radar-chart/build/css/index.css'
class conseil_joueur extends Component {
    constructor(props){
        super (props);
        this.state = {
        pseudos:this.props.match.params.pseudo,
        champion:this.props.match.params.champion,
        notes:axios.get("http://localhost:8080"+this.props.match.url).then(response=>{this.setState({notes:response.data.notesTab}); this.setState({stats:response.data.statsTab})}),
        stats:{}
        }
        this.data=[
            {
                data:{
                    Damage:(this.state.notes.Damage)/10,
                    Farm:(this.state.notes.Farm)/10,
                    Golds:(this.state.notes.Golds)/10,
                    Vision:(this.state.notes.Vision)/10,
                    killParticipation:(this.state.notes.killParticipation)/10,

                },
                meta:{color:'red'}
            },
            {data:{
                Damage:0.7,
                Farm:0.7,
                Golds:0.7,
                Vision:0.7,
                killParticipation:0.7,
        
            },
            meta:{color:'green'}
            }
        ]
        this.captions={
            Damage:'Damage',
            Farm:'Farm',
            Golds:'Golds',
            Vision:'Vision',
            killParticipation:'kill participation'
        };
        this.handleClick=this.handleClick.bind(this);
    }
    
    
    handleClick(event){
        console.log(this.state.pseudos)
        console.log(this.state.champion)
        console.log(this.state.notes)
        console.log(this.state.stats)
    }
    render() { 
        return (
            <div>
                <h1>
                    Home
                </h1>
                <button onClick={this.handleClick}>
                    CLICKKKKKKKKKKKKK
                </button>
                <h1>{this.state.notes.Damage}</h1>
                <RadarChart captions={this.captions} data={[
            {
                data:{
                    Damage:(this.state.notes.Damage)/10,
                    Farm:(this.state.notes.Farm)/10,
                    Golds:(this.state.notes.Golds)/10,
                    Vision:(this.state.notes.Vision)/10,
                    killParticipation:(this.state.notes.killParticipation)/10,

                },
                meta:{color:'red'}
            },
            {data:{
                Damage:1,
                Farm:1,
                Golds:1,
                Vision:1,
                killParticipation:1,
        
            },
            meta:{color:'green'}
            }
        ]} size={450} />
            </div>
         );
    }
}
 
export default conseil_joueur