import React from 'react';
import './App.css';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect
} from "react-router-dom";

import Login from "./components/login.js";
import Register from "./components/register.js";
import Home from "./components/home.js";
import Channel from "./components/channel.js";

function App() {
  return (<Router>
    <div className="App">
      {/* <div className="container">
        <Link to={"/login"}>Login</Link>
        <br />
        <Link to={"/register"}>Sign up</Link>
      </div> */}


      <div className="auth-wrapper">
        <div className="auth-inner">
          <Switch>
            <Route path="/login" component={Login} />
            <Route path="/register" component={Register} />
            <PrivateRoute path="/home" component={Home} /> 
            <PrivateRoute  path="/channel/:id" component={Channel} />
            <Route exact path="/" component={Login} />
          </Switch>
        </div>
      </div>
    </div></Router>
  );
}

class PrivateRoute extends React.Component {
  constructor(props) {
    super(props);
  }

  checkloggedin() {
    return localStorage.getItem('isLoggedin') === 'true'
  }

  render() {
    if (this.checkloggedin()) {
      return (
        <Route {...this.props} />
      )
    } else {
      return <Route><Redirect to="/login" /></Route>
    }
  }
}

export default App;
