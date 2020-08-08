import React, { Component } from "react";
import { urlget } from '../utils/fetch-helper';
import Channelbody from "./channelbody";
import Channelheader from "./channelheader";

export default class Channel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            channel_id: this.props.match.params.id,
            channel_name: null,
            channel_members: null
        };
        let params = {
            'channel_id': this.state.channel_id
        };

        let getChannelDetailsPromise = urlget('/get-channel-details', params)
        getChannelDetailsPromise.then(function (abcd) { return abcd.json() })

            .then(jsonResponse => {
                console.log(jsonResponse);
                if (jsonResponse !== 'Excess denied' || jsonResponse !== 'Failed to get channel details') {
                    this.setState({
                        channel_members: jsonResponse.users,
                        channel_name: jsonResponse.channel_name,
                        messages: jsonResponse.messages
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

    render() {
        return (
            <div>
                <div>
                    {this.state.channel_name !== null ? (< Channelheader channel_id={this.state.channel_id} channel_name={this.state.channel_name} channel_members={this.state.channel_members} />) : ("Loading..")}
                </div>
                <div>
                    {this.state.channel_name !== null ? (< Channelbody channel_id={this.state.channel_id} channel_name={this.state.channel_name} channel_members={this.state.channel_members} messages={this.state.messages} />) : ("Loading..")}
                </div>
            </div>

        )
    }
}