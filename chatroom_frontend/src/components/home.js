import React, { Component } from "react";
import { urlpost } from '../utils/fetch-helper';
import {
    Link, useHistory
} from "react-router-dom";

export default class Home extends Component {
    constructor(props) {
        super(props);

        this.state = {
            newChannel: null,
            username: localStorage.getItem('username'),
            channels: JSON.parse(localStorage.getItem('channels')),
        };
    }

    handleClickLogout() {
        localStorage.setItem("isLoggedin", 'false');
        window.location = '/';
    }

    handleClickAddChannel(evt) {

        evt.preventDefault();

        let params = {      
            'newChannel': this.state.newChannel
        };
        let addNewChannelPromise = urlpost('/add-channel', params)


        addNewChannelPromise.then(function (abcd) { return abcd.json() })

            .then(jsonResponse => {
                console.log(jsonResponse);
                if (jsonResponse !== 'Not saved') {

                    localStorage.setItem("channels", JSON.stringify(jsonResponse.channels));
                    this.setState({
                        channels: JSON.parse(localStorage.getItem('channels')),
                        newChannel: ''
                    })
                }
                else {
                    alert('Unsuccessful! Please try again')
                }
            })

            .catch(function (error) {
                console.log(error);
            });
    }

    handleAddNewChannel(event) {
        this.setState({ newChannel: event.target.value })
    }

    render() {
        return (

            <div>
                <div>
                    <h3>{this.state.username}</h3>
                    <button variant="primary" style={{ width: '210px' }} size="lg" onClick={this.handleClickLogout.bind(this)}>Log out</button></div>
                <div>
                    {
                        this.state.channels.map((channel) =>
                            <li><Link to={`/channel/${channel.channel_id}`}>{channel.channel_name}</Link> </li>
                        )
                    }
                </div>
                <div className="control-button">
                    <form>
                        <label>
                            <input type="text" value={this.state.newChannel} onChange={this.handleAddNewChannel.bind(this)} required />
                        </label>
                        <button variant="primary" style={{ width: '210px' }} size="lg" onClick={this.handleClickAddChannel.bind(this)}>Add Channel</button>
                    </form>

                </div>
            </div>


        )
    }
}