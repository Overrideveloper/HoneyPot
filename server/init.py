from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
import os

app = __name__
server = Flask(app)

basedir = os.path.abspath(os.path.dirname(__file__))

server.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///{}'.format(os.path.join(basedir, 'honeypot.db'))
server.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(server)
marsh = Marshmallow(server)

class Admin(db.Model):
  id = db.Column(db.Integer, primary_key = True)
  username = db.Column(db.String(80), unique = True)
  password = db.Column(db.String(10))

  def __init__(self, username, password):
    self.username = username
    self.password = password

class AdminSchema(marsh.Schema):
  class Meta:
    fields = ('id', 'username', 'password')

class User(db.Model):
  id = db.Column(db.Integer, primary_key = True)
  username = db.Column(db.String(80), unique = True)
  password = db.Column(db.String(10))
  name = db.Column(db.String(80), unique = False)
  phone = db.Column(db.Integer, unique = True)
  serial_no = db.Column(db.Integer, unique = True)
  department = db.Column(db.String(80), unique = False)
  imei = db.Column(db.Integer, unique = True)
  ca1 = db.Column(db.Integer, unique = False)
  ca2 = db.Column(db.Integer, unique = False)
  ca3 = db.Column(db.Integer, unique = False)
  total = db.Column(db.Integer, unique = False)

  def __init__(self, username, password, name, phone, serial_no, department, imei, ca1, ca2, ca3, total):
    self.username = username
    self.password = password
    self.name = name
    self.phone = phone
    self.serial_no = serial_no
    self.department = department
    self.imei = imei
    self.ca1 = ca1
    self.ca2 = ca2
    self.ca3 = ca3

class UserSchema(marsh.Schema):
  class Meta:
    fields = ('id', 'username', 'password', 'name', 'phone', 'serial_no', 'department', 'imei', 'ca1', 'ca2', 'ca3', 'total')

class Digest(db.Model):
  id = db.Column(db.Integer, primary_key = True)
  digest = db.Column(db.String(80), unique = True)
  user = db.Column(db.Integer)
  created = db.Column(db.Integer)
  expires = db.Column(db.Integer)

  def __init__(self, digest, user, created, expires):
    self.digest = digest
    self.created = created
    self.expires = expires
    self.user = user

class DigestSchema(marsh.Schema):
  class Meta:
    fields = ('id', 'digest', 'user', 'created', 'expires')

class Log(db.Model):
  id = db.Column(db.Integer, primary_key = True)
  user = db.Column(db.String(80))
  time = db.Column(db.Integer)
  attempts = db.Column(db.Integer)
  success = db.Column(db.Boolean)

  def __init__(self, user, time, attempts, success):
    self.user = user
    self.time = time
    self.attempts = attempts
    self.success = success

class LogSchema(marsh.Schema):
  class Meta:
    fields = ("id", "user", "time", "attempts", "success")

admin_schema = AdminSchema()
admins_schema = AdminSchema(many = True)

user_schema = UserSchema()
users_schema = UserSchema(many = True)

digest_schema = DigestSchema()
digests_schema = DigestSchema(many = True)

log_schema = LogSchema()
logs_schema = LogSchema(many = True)
