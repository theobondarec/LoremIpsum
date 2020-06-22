import React from 'react';
import NavBar from './pages/navbar'
import './App.css';
import TableauChampion from './pages/TableauChampion';
import {BrowserRouter as Router, Switch,Route } from 'react-router-dom';
import championInfo from './pages/championInfo'
import Home from './pages/Home'
import Conseil from './pages/conseil'
import conseil_joueur from './pages/conseil_joueur'

import Profile from './pages/profile'
import Profile_joueur from './pages/user_profile'

function App() {
  
  return (
    <React.Fragment>
        <Router>
          <NavBar />
          <Switch>
            <Route path="/" exact component={Home}/>
            <Route path="/Champion/:id" component={championInfo}/>
            <Route path="/Champion" exact component={TableauChampion}/>
            <Route path="/Profile" exact component={Profile}/>
            <Route path="/Profile/:pseudo" exact component={Profile_joueur}/>
            <Route path="/Conseil" exact component={Conseil}/>
            <Route path="/Conseil/:pseudo/:champion" exact component={conseil_joueur}/>

          </Switch>
        </Router>
    </React.Fragment>
  );
}

export default App;
