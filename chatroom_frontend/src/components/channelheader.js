import React, { Component } from "react";
import { urlget } from '../utils/fetch-helper';
import { urlpost } from '../utils/fetch-helper';

export default class Channelheader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            channel_name: this.props.channel_name,
            channel_members: this.props.channel_members,
            new_member: ''
        };
    }

    handleClickLogout() {
        localStorage.setItem("isLoggedin", 'false');
        window.location = '/';
    }

    handleClickAddMember(evt) {
        evt.preventDefault();

        let params = {
            'channel_id': this.props.channel_id,
            'newMember': this.state.new_member,
        };
        let addNewMemberPromise = urlpost('/add-member', params)
        addNewMemberPromise.then(function (abcd) { return abcd.json() })
            .then(jsonResponse => {
                console.log(jsonResponse);
                if (jsonResponse !== 'Failed to add new memeber' && jsonResponse !== 'No user found' && jsonResponse !=='Already a member') {
                    localStorage.setItem("channels", JSON.stringify(jsonResponse.channels));
                    this.setState({
                        channel_members: jsonResponse.users,
                        new_member: ''
                    })
                }
                else {
                    
                    alert(jsonResponse)
                }
            })

            .catch(function (error) {
                console.log(error);
            });
    }

    handleAddMember(event) {
        this.setState({ new_member: event.target.value })
    }

    render() {
        return (
            <div>
                <div>
                    <h3>{this.state.channel_name}</h3>
                    <h3>Members:{this.state.channel_members.length}</h3>
                </div>
                <div className="control-button">
                    <form>
                        <label>
                            <input type="text" value={this.state.new_member} onChange={this.handleAddMember.bind(this)} required />
                        </label>
                        <button variant="primary" style={{ width: '210px' }} size="lg" onClick={this.handleClickAddMember.bind(this)}>Add Member</button>
                    </form>

                </div>
            </div>

        )
    }
}