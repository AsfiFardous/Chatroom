
from flask import Flask
from flask_sqlalchemy import SQLAlchemy

from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker
from marshmallow_sqlalchemy import SQLAlchemyAutoSchema
import datetime

db = SQLAlchemy()

user_channels= db.Table('user_channels',
    db.Column('u_id', db.Integer, db.ForeignKey('user.user_id'), primary_key=True),
    db.Column('ch_id', db.Integer, db.ForeignKey('channel.channel_id'), primary_key=True)
)

class User(db.Model):
    user_id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=False, nullable=False)
    password = db.Column(db.String(120), unique=True, nullable=False)
    messages = db.relationship('Message', backref='user', lazy=True)
    channels = db.relationship('Channel', secondary=user_channels, lazy='subquery',
        backref = db.backref('users', lazy=True))


class Channel(db.Model):
    channel_id = db.Column(db.Integer, primary_key=True)
    channel_name = db.Column(db.String(80), unique=True, nullable=False)
    messages = db.relationship('Message', backref='channel', lazy=True)
            

class Message(db.Model):
    message_id = db.Column(db.Integer, primary_key=True)
    message_body = db.Column(db.Text(120), nullable=False)
    message_time = db.Column(db.DateTime,  default=datetime.datetime.utcnow, nullable=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.user_id'),
        nullable=False)
    channel_id = db.Column(db.Integer, db.ForeignKey('channel.channel_id'),
        nullable=False)


class UserSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = User
        include_relationships = True
        include_fk = True
        load_instance = True


class ChannelSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Channel
        include_relationships = True
        include_fk = True
        load_instance = True

class MessageSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Message
        include_fk = True
        include_relationships = True
        load_instance = True
