import React from 'react';
import NavBar from './component/navbar'
import './App.css';
import TableauChampion from './component/TableauChampion';
import {BrowserRouter as Router, Switch,Route } from 'react-router-dom';
import championInfo from './component/championInfo'

//document.body.style.backgroundColor = "fcfcfc";

export default function App() {
  return (
    <div>
      <React.Fragment>
        <Router>
          <NavBar />
          <Switch>
            <Route path="/" exact component={Home}/>
            <Route path="/Champion/:id" component={championInfo}/>
            <Route path="/Champion" exact component={TableauChampion}/>
          </Switch>
        </Router>
    </React.Fragment>
    </div>
    
  );
}
const Home=()=>(
  <div>
    <h1>HOME PAGE</h1>
  </div>
)

/*
export default function App() {
  return (
    <div className = "container">
      <div className = "row">
        <div className = "col">
          
        </div >
        <div className = "col-8">
          
        </div >
        <div className = "col">
          
        </div >
      </div>
      
    </div>
    
  )
}
*/