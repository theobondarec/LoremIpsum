import React from 'react';
import NavBar from './component/navbar'
import './App.css';
import TableauChampion from './component/TableauChampion';
import {BrowserRouter as Router, Switch,Route } from 'react-router-dom';
import championInfo from './component/championInfo'


function App() {
  return (
    <React.Fragment>
        <Router>
          <NavBar/>
          <Switch>
            <Route path="/" exact component={Home}/>
            <Route path="/Champion/:id" component={championInfo}/>
            <Route path="/Champion" exact component={TableauChampion}/>
          </Switch>
        </Router>
    </React.Fragment>
  );
}
const Home=()=>(
  <div>
    <h1>HOME PAGE</h1>
  </div>
)
export default App;
