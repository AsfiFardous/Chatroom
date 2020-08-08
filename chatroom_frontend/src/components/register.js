import React, { Component } from "react";
import {urlpost} from '../utils/fetch-helper';
import {
    Link, useHistory,
    useLocation
  } from "react-router-dom";

export default class Register extends Component {
    constructor(props) {
        super(props);
        
        this.state = {         
            user_name: null,
            password1: null,
            password2: null,
            email: null
        };
    }

    handleClickRegister(evt){
        evt.preventDefault();
        if(this.state.password1 != this.state.password2){
            alert('Password does not match')
        }      
        else{
            let params={ 
                username:this.state.user_name,
                email:this.state.email,
                password:this.state.password1,               
            };
            let userRegisterPromise = urlpost("/signup", params)
            userRegisterPromise.then(function (abcd) { return abcd.json() })
            .then(jsonResponse => {
                console.log(jsonResponse);

                if (jsonResponse === 'saved') {
                    // window.location('/login')
                    window.location.href = "/login";
                }
                else{
                    alert('Registration failed. Please try again')
                }
                
            })
        }
       
    }
   

    handleUsernameChange(event){
        this.setState({ user_name: event.target.value })
    }
    handleFirstPasswordChange(event){
        this.setState({ password1: event.target.value })
    }
    handleSecondPasswordChange(event){
        this.setState({ password2: event.target.value })       
    }
    handleEmailChange(event){
        this.setState({ email: event.target.value })
    }

    render() {
        return (
            <form>
                <h3>Register here</h3>

                <div className="form-group">
                    <label>Username</label>
                    <input type="text" className="form-control" placeholder="Enter username" value={this.state.user_name} onChange={this.handleUsernameChange.bind(this)} required />
                </div>

                <div className="form-group">
                    <label>Email address</label>
                    <input type="email" className="form-control" placeholder="Enter email" value={this.state.email} onChange={this.handleEmailChange.bind(this)} required />
                </div>

                <div className="form-group">
                    <label>Password</label>
                    <input type="password" className="form-control" placeholder="Enter password" value={this.state.password1} onChange={this.handleFirstPasswordChange.bind(this)} required  />
                </div>
                <div className="form-group">
                    <label>Confirm Password</label>
                    <input type="password" className="form-control" placeholder="Confirm password" value={this.state.password2} onChange={this.handleSecondPasswordChange.bind(this)} required />
                </div>


                <button type="submit" className="btn btn-primary btn-block" onClick={this.handleClickRegister.bind(this)}>Sign Up</button>
                <p className="forgot-password text-right">
                    Already registered <Link to={"/login"}>sign in?</Link>
                </p>
            </form>
        );
    }
}