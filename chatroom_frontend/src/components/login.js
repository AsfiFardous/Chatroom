import React, { Component } from "react";
import { urlget } from '../utils/fetch-helper';
import { urlpost } from '../utils/fetch-helper';
import {
    Link, useHistory
} from "react-router-dom";

export default class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            user_name: null,
            password: null,
        };
    }

    handleClickLogin(evt) {

        evt.preventDefault();
        let params = {
            'username': this.state.user_name,
            'password': this.state.password
        };
        let isUserPromise = urlpost('/signin', params)
        isUserPromise.then(function (abcd) { return abcd.json() })
            .then(jsonResponse => {
                console.log(jsonResponse);

                if (jsonResponse !== 'wrong user') {
                    localStorage.setItem('user_id', jsonResponse.user_id);
                    localStorage.setItem('username', jsonResponse.username);
                    localStorage.setItem('email', jsonResponse.email);
                    localStorage.setItem("channels", JSON.stringify(jsonResponse.channels));
                    localStorage.setItem("isLoggedin", 'true');

                    this.props.history.push('/home')
                }
                else {
                    alert('No corresponding user found. Please try again')
                }

            })

            .catch(function (error) {
                console.log(error);
            });
    }


    handleUsernameChange(event) {
        this.setState({ user_name: event.target.value })
    }
    handlePasswordChange(event) {
        this.setState({ password: event.target.value })
    }

    render() {
        return (
            <form>
                <h3>Sign In</h3>

                <div className="form-group">
                    <label>Username</label>
                    <input type="text" className="form-control" placeholder="Enter username" value={this.state.user_name} onChange={this.handleUsernameChange.bind(this)} required />
                </div>

                <div className="form-group">
                    <label>Password</label>
                    <input type="password" className="form-control" placeholder="Enter password" value={this.state.password} onChange={this.handlePasswordChange.bind(this)} required />
                </div>

                <div className="form-group">
                    <div className="custom-control custom-checkbox">
                        <input type="checkbox" className="custom-control-input" id="customCheck1" />
                        <label className="custom-control-label" htmlFor="customCheck1">Remember me</label>
                    </div>
                </div>

                <button type="submit" className="btn btn-primary btn-block" onClick={this.handleClickLogin.bind(this)}>Submit</button>
                <p className="forgot-password text-right">
                    Forgot <a href="#">password?</a>
                    <br />
                    Not registered yet?<Link to={"/register"}>Sign up here</Link>
                </p>
            </form>
        );
    }
}