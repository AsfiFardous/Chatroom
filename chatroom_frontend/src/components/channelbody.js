import React, { Component } from "react";

import io from 'socket.io-client';

var socket = io('ws://localhost:5000/');

export default class Channelbody extends Component {
    constructor(props) {
        super(props);
        this.state = {
            channel_id: this.props.channel_id,
            channel_name: this.props.channel_name,
            username: localStorage.getItem('username'),
            messages: this.props.messages || [],
            new_message: null,
        };

        socket.on(this.state.channel_name, data => {
            data = JSON.parse(data)
            let copy_messages = this.state.messages.slice()
            copy_messages.push(data.message)
            this.setState({
                messages: copy_messages,
                new_message: ''
            })
        });

    }

    handleClickSend(evt) {
        evt.preventDefault();
        socket.emit('submit message', { 'message': this.state.new_message, 'channel_id': this.state.channel_id });
    }

    handleChange(event) {
        this.setState({ new_message: event.target.value })
    }

    render() {
        return (
            <div>
                {
                    (this.state.messages && this.state.messages.length > 0) && (
                        <div className="chatWindow">
                            <ul className="chat" id="chatList">
                                {this.state.messages.map((data) => (
                                    <div>
                                        {this.state.username === data.username ? (
                                            <li className="self">
                                                <div className="msg">
                                                    <p>{data.username}</p>
                                                    <div className="message"> {data.message_body}</div>
                                                </div>
                                            </li>
                                        ) : (
                                                <li className="other">
                                                    <div className="msg">
                                                        <p>{data.username}</p>
                                                        <div className="message"> {data.message_body} </div>
                                                    </div>
                                                </li>
                                            )}
                                    </div>
                                ))}
                            </ul>

                        </div>
                    )
                }

                <div className="chatInputWrapper">
                    <form >
                        <input
                            className="textarea input"
                            type="text"
                            placeholder="Enter your message..."
                            value={this.state.new_message} onChange={this.handleChange.bind(this)}
                        />
                        <button type="submit" className="btn btn-primary btn-block" onClick={this.handleClickSend.bind(this)}>Send</button>
                    </form>
                </div>

            </div >
        );
    }

}
