import os
from flask import Flask, request, jsonify
import bcrypt, random, time, string, requests, json, datetime
from init import db, server, marsh, user_schema, users_schema, admin_schema, admins_schema, digest_schema, digests_schema, User, Admin, Digest, Log, log_schema, logs_schema
from pathlib import Path

EMAIL = "bansowisdom@gmail.com"
IP_API_KEY = "45dd948f2fbc21366d45b7df94d39ce4"
API_KEY = "62bb636c55e098176cff104481ac35ac1a1b8022"


def id_generator(size=6, chars=string.ascii_uppercase + string.digits):
  return ''.join(random.choice(chars) for _ in range(size))

def adminCount():
    admins = Admin.query.all()
    result = admins_schema.dump(admins).data
    return len(result)

def createAdmin(_username, _password):
    username = _username
    password = bcrypt.hashpw(_password.encode('utf8'), bcrypt.gensalt())
    new_admin = Admin(username, password)

    db.session.add(new_admin)
    db.session.commit()
    return 200

def createUser(_name, _phone, _serial_no, _department, _imei):
    userCheck = User.query.filter_by(imei = _imei).first()
    if userCheck == None:
        username = _name.rsplit(' ', 1)[1] + str(random.randint(1, 99))
        _password = id_generator()
        password = bcrypt.hashpw(_password.encode('utf8'), bcrypt.gensalt())
        name = _name
        phone = _phone
        serial_no = _serial_no
        department = _department
        imei = _imei
        ca1 = None
        ca2 = None
        ca3 = None
        total = None

        new_user = User(username, password, name, phone, serial_no, department, imei, ca1, ca2, ca3, total)

        db.session.add(new_user)
        db.session.commit()
        response = {"username": username, "password": _password}
    else:
      response = False
    return response

def listUser():
  users = User.query.all()
  result = users_schema.dump(users).data
  return result

#log
def checkUser(_username, _password, attempts = 0):
  user = User.query.filter_by(username = _username).first()
  if user == None:
    response = None
  else:
    passwordCheck = bcrypt.checkpw(_password.encode('utf8'), user.password)
    if passwordCheck == True:
      name = str(user.name)
      imei = str(user.imei)
      serial_no = str(user.serial_no)
      phone = str(user.phone)

      nameString = name[random.randint(1, len(name)-1)] + name[random.randint(1, len(name)-1)]
      imeiString = imei[random.randint(1, len(imei)-1)] + imei[random.randint(1, len(imei)-1)]
      serialString = serial_no[random.randint(1, len(serial_no)-1)] + serial_no[random.randint(1, len(serial_no)-1)]
      phoneString = phone[random.randint(1, len(phone)-1)] + phone[random.randint(1, len(phone)-1)]

      digest = str(nameString + imeiString + serialString + phoneString).upper()
      created = time.time()
      expires = created + (5 * 60 * 60)
      otp = Digest(digest, user.id, created, expires)

      db.session.add(otp)
      db.session.commit()
      phone = '234' + phone
      sendOTP(phone, digest)
      response = 200
    else:
      log = Log(user.username, time.time(), attempts, False)
      db.session.add(log)
      db.session.commit()
      response = None
  return response

def sendOTP(phone, digest):
  message = 'Your verification code is ' + str(digest).upper() + '. It expires in 5 minutes.'
  response = requests.post('http://api.ebulksms.com:8080/sendsms.json', json = {
    "SMS": {
      "auth": {
        "username": EMAIL,
        "apikey": API_KEY
      },
      "message": {
        "sender": "Honey Pot",
        "messagetext": message,
        "flash": 0
      },
      "recipients": {
        "gsm": [
          {
            "msidn": phone,
            "msgid": id_generator()
          }
        ]
      },
      "dndsender": 1
    }
  })

#log
def login(_otp, attempts):
  otp = Digest.query.filter_by(digest = _otp).first()
  if otp == None:
    response = None
  else:
    if time.time() > otp.expires:
      response = False
    else:
      user = User.query.get(otp.user)
      user = user_schema.dump(user).data
      print(user['username'])
      log = Log(user['username'], time.time(), attempts, True)
      db.session.add(log)
      db.session.commit()
      response = { "user": user }
  return response

def requestLocation():
  URL = 'http://api.ipstack.com/check?access_key=' + IP_API_KEY
  response = requests.get(URL)
  geo_data = json.loads(response.text)
  return geo_data

#log
def sendAlert(phone, _username, attempts):
  user = User.query.filter_by(username = _username).first()
  if user == None:
    print("No user found")
  else:
    log = Log(_username, time.time(), attempts, False)
    db.session.add(log)
    db.session.commit()
    number = '234' + str(user.phone)
    print(number)
    location = requestLocation()
    _time = datetime.datetime.now().strftime("%I:%M%p on %B %d, %Y")
    partial1 = 'A device with the phone number ' + phone + ' attempted to access your account by ' + _time + ' from'
    partial2 = ' ' + location['city'] + ', ' + location['region_name'] + ', ' + location['country_name'] + ', ' + location['continent_name'] + '.'
    message = partial1 + partial2
    response = requests.post('http://api.ebulksms.com:8080/sendsms.json', json = {
        "SMS": {
            "auth": {
                "username": EMAIL,
                "apikey": API_KEY
            },
            "message": {
                "sender": "Honey Pot",
                "messagetext": message,
                "flash": 0
            },
            "recipients": {
                "gsm": [
                    {
                        "msidn": number,
                        "msgid": id_generator()
                    }
                ]
            },
            "dndsender": 1
        }
    })
    print(response)
    print(response.text)

def adminLogin(_username, _password):
    admin = Admin.query.filter_by(username = _username).first()
    if admin == None:
        response = None
    else:
        passwordCheck = bcrypt.checkpw(_password.encode('utf8'), admin.password)
        if passwordCheck == True:
            response = admin
        else:
            response = None
    return response

def setScores(_id, ca1, ca2, ca3):
    user = User.query.filter_by(id = _id).first()
    if user == None:
        response = False
    else:
        ca1 = int(ca1)
        ca2 = int(ca2)
        ca3 = int(ca3)
        total = ca1 + ca2 + ca3
        user.ca1 = ca1
        user.ca2 = ca2
        user.ca3 = ca3
        user.total = total
        db.session.commit()
        response = True
    return response

def getUser(_id):
    print(_id)
    user = User.query.filter_by(id = _id).first()
    if user == None:
        response = None
    else:
        print(user)
        response = user
    return response

def getLogs():
  logs = Log.query.all()
  result = logs_schema.dump(logs).data
  return result
