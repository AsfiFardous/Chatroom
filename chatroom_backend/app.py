import os
import sys

from flask import Flask, request, session, jsonify


from flask_session import Session
from flask_socketio import SocketIO, emit, send
from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
import model
import json
import datetime


app = Flask(__name__)

app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

app.debug = True

app.config["SECRET_KEY"] = 'potato'  

app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root:1234@localhost/chatroom'


model.db.init_app(app)

migrate = Migrate(app, model.db)


socketio = SocketIO(app, cors_allowed_origins="*")


@app.route("/signin",  methods=["POST"])
def signin():
    jsondata = request.get_json()
    username = jsondata["username"]
    password = jsondata["password"]

    user = model.User.query.filter_by(
        username=username, password=password).first()

    if user is None:
        return jsonify('wrong user')
    else:
        user_schema = model.UserSchema()
        user_data = user_schema.dump(user)
        channel_schema = model.ChannelSchema()
        user_data['channels'] = [channel_schema.dump(c) for c in user.channels]
        session["user_id"] = user_data['user_id']
        session["username"] = user_data['username']

        user_dict = {
            'user_id': user_data['user_id'],
            'username': user_data['username'],
            'email': user_data['email'],
            'channels': user_data['channels']
        }

        return jsonify(user_dict)


@app.route("/signup",  methods=["POST"])
def signup():
    jsondata = request.get_json()
    username = jsondata["username"]
    password = jsondata["password"]
    email = jsondata["email"]
    try:
        me = model.User(username=username, email=email, password=password)
        model.db.session.add(me)
        model.db.session.commit()
        return jsonify('saved')

    except Exception:
        return jsonify('Not saved')


@app.route("/add-channel", methods=["POST"])
def addchannel():
    jsondata = request.get_json()
    channel = jsondata["newChannel"]
    user_id = session['user_id']

    try:
        user = model.User.query.filter_by(user_id=user_id).first()
        me = model.Channel(users=[user, ], channel_name=channel)
        model.db.session.add(me)
        model.db.session.commit()
        user = model.User.query.filter_by(user_id=user_id).first()
        user_schema = model.UserSchema()
        user_data = user_schema.dump(user)
        channel_schema = model.ChannelSchema()
        user_data['channels'] = [channel_schema.dump(c) for c in user.channels]
        user_dict = {
            'channels': user_data['channels']
        }
        return jsonify(user_dict)

    except Exception as e:
        return jsonify('Not saved')


@app.route("/get-channel-details",  methods=["GET"])
def getchanneldetails():
    try:
        channel_id = request.args.get("channel_id")
        channel = model.Channel.query.filter_by(channel_id=channel_id).first()

        channel_schema = model.ChannelSchema()
        channel_data = channel_schema.dump(channel)
        user_schema = model.UserSchema()
        channel_data['users'] = [c.username for c in channel.users]
        data = [{
                'message_body': message.message_body,
                'message_time': message.message_time,
                'username': message.user.username
                } for message in channel.messages]

        channel_dict = {
            'channel_name': channel_data['channel_name'],
            'users': channel_data['users'],
            'messages': data
        }

        return jsonify(channel_dict)

    except Exception as e:

        return jsonify('Failed to get channel details')


@app.route("/add-member", methods=["POST"])
def addmember():
    jsondata = request.get_json()
    member = jsondata["newMember"]
    channel_id = jsondata["channel_id"]
    try:
        user = model.User.query.filter_by(username=member).first()
        if user is None:
            return jsonify('wrong user')
        else:
            try:
                channel = model.Channel.query.filter_by(
                    channel_id=channel_id).first() 
                if user in channel.users:
                    return jsonify('Already a member')
                else:
                    channel.users.append(user)             
                    model.db.session.commit()             
                    channel_schema = model.ChannelSchema()
                    channel_data = channel_schema.dump(channel)
                    user_schema = model.UserSchema()
                    channel_data['users'] = [c.username for c in channel.users]              
                    member_dict = {
                        'users': channel_data['users'],
                    }
                    return jsonify(member_dict)

            except Exception as e:
                return jsonify('Failed to add new memeber')
    except Exception as e:
        return jsonify('No user found')            




@socketio.on("submit message")
def message(data):
    message = data["message"]
    user_id = session["user_id"]
    username = session["username"]
    channel_id = data["channel_id"]
    channel = model.Channel.query.filter_by(
        channel_id=channel_id).first()
    user_ids = [c.user_id for c in channel.users]
    if user_id in user_ids:
        try:
            me = model.Message(message_body=message,
                               user_id=user_id, channel_id=channel_id)
            model.db.session.add(me)
            model.db.session.commit()
            message = {
                'message_body': message,
                'message_time': str(datetime.datetime.now()),
                'username': username
            }
            print(message, channel.channel_name)
            emit(channel.channel_name, json.dumps({"message": message}),broadcast=True)
        except Exception:
            return jsonify('Message sending failed')

    else:
        return jsonify('Excess denied')


if __name__ == '__main__':
    socketio.run(app, debug=True)
