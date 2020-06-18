import React from 'react';
import NavBar from './component/navbar'
import './App.css';
import TableauChampion from './component/TableauChampion';
import {BrowserRouter as Router, Switch,Route } from 'react-router-dom';
import championInfo from './component/championInfo'
import Home from './component/Home'
import Conseil from './pages/conseil'
import conseil_joueur from './pages/conseil_joueur'

function App() {
  
  return (
    <React.Fragment>
        <Router>
          <NavBar/>
          <Switch>
            <Route path="/" exact component={Home}/>
            <Route path="/Champion/:id" component={championInfo}/>
            <Route path="/Champion" exact component={TableauChampion}/>
            <Route path="/Conseil" exact component={Conseil}/>
            <Route path="/Conseil/:pseudo/:champion" exact component={conseil_joueur}/>

          </Switch>
        </Router>
    </React.Fragment>
  );
}

export default App;
