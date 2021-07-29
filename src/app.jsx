/*global $*/
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Dashboard } from './components';


//Root sass file for webpack to compile
import './sass/main.scss';

class App extends Component {

  render() {
    return (
      <div>
        <Dashboard />
      </div>)
  }
}

ReactDOM.render(<App />, document.getElementById('dashboard-mount'));


