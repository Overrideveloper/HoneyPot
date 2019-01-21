from init import server
from flask import Flask, jsonify, request, make_response, current_app, redirect, url_for, send_from_directory
from functools import update_wrapper
from datetime import timedelta
import auth

def crossdomain(origin=None, methods=None, headers=None, max_age=21600, attach_to_all=True, automatic_options=True):
    if methods is not None:
        methods = ', '.join(sorted(x.upper() for x in methods))
    if headers is not None and not isinstance(headers, list):
        headers = ', '.join(x.upper() for x in headers)
    if not isinstance(origin, list):
        origin = ', '.join(origin)
    if isinstance(max_age, timedelta):
        max_age = max_age.total_seconds()

    def get_methods():
        if methods is not None:
            return methods

        options_resp = current_app.make_default_options_response()
        return options_resp.headers['allow']

    def decorator(f):
        def wrapped_function(*args, **kwargs):
            if automatic_options and request.method == 'OPTIONS':
                resp = current_app.make_default_options_response()
            else:
                resp = make_response(f(*args, **kwargs))
            if not attach_to_all and request.method != 'OPTIONS':
                return resp

            h = resp.headers

            h['Access-Control-Allow-Origin'] = origin
            h['Access-Control-Allow-Methods'] = get_methods()
            h['Access-Control-Max-Age'] = str(max_age)
            if headers is not None:
                h['Access-Control-Allow-Headers'] = headers
            return resp

        f.provide_automatic_options = False
        return update_wrapper(wrapped_function, f)
    return decorator

@server.route("/")
@crossdomain(origin = "*")
def welcome():
    response = jsonify(message = "Honey Pot Encryption Web Service")
    response.status_code = 200
    return response

@server.route("/admin/new", methods = ["POST"])
@crossdomain(origin = "*")
def newAdmin():
    username = request.form.get('username')
    password = request.form.get('password')

    process = auth.createAdmin(username, password)

    if process == 200:
        response = jsonify(message = True, code = 200)
        response.status_code = 200
    else:
        response = jsonify(message = False, code = 200, data = "Error occurred. Try again")
        response.status_code = 200
    return response

@server.route("/admin/login", methods = ["POST"])
@crossdomain(origin = "*")
def adminLogin():
    username = request.form.get('username')
    password = request.form.get('password')

    process = auth.adminLogin(username, password)

    if process == None:
        response = jsonify(message = False, code = 200, data = "Username or password incorrect")
        response.status_code = 200
    else:
        data = { "id": process.id, "username": process.username }
        response = jsonify(message = True, code = 200, data = data)
        response.status_code = 200
    return response

@server.route("/admin/count")
@crossdomain(origin = "*")
def adminCount():
    count = auth.adminCount()
    response = jsonify(message = True, code = 200, data = count)
    response.status_code = 200
    return response

@server.route("/user/new", methods = ['POST'])
@crossdomain(origin = "*")
def newUser():
    name = request.form.get('name')
    phone = request.form.get('phone')
    serial_no = request.form.get('serial_no')
    department = request.form.get('department')
    imei = request.form.get('imei')

    process = auth.createUser(name, phone, serial_no, department, imei)

    if process == False:
        response = jsonify(message = False, code = 200, data = "User already registered")
        response.status_code = 200
    else:
        response = jsonify(message = True, code = 200, data = process)
        response.status_code = 200
    return response

@server.route("/user/list")
@crossdomain(origin = "*")
def listUser():
    process = auth.listUser()
    print(process)
    response = jsonify(message = True, code = 200, data = process)
    response.status_code = 200
    return response

@server.route("/auth/login/one", methods = ['POST'])
@crossdomain(origin = "*")
def stepOneLogin():
  username = request.form.get('username')
  password = request.form.get('password')
  trial = request.form.get('trial')
  trial = int(trial)

  if (trial > 0):
    attempts = 3 - (trial - 1)
  else:
    attempts = 3
  process = auth.checkUser(username, password, attempts)
  if process == None:
      trial = trial - 1
      response = jsonify(message = False, code = 200, data = { "msg": 'Username or password incorrect. Please try again.', "trial": trial })
      response.status_code = 200
  else:
      response = jsonify(message = True, code = 200, data = 'A verification code has been sent to your phone number' )
      response.status_code = 200
  return response

@server.route("/auth/login/two", methods = ['POST'])
@crossdomain(origin = "*")
def stepTwoLogin():
    otp = request.form.get('otp')
    trial = request.form.get('trial')
    trial = int(trial)

    if (trial > 0):
      attempts = 3 - (trial - 1)
    else:
      attempts = 3

    process = auth.login(otp, attempts)
    #print(process)
    if process == None or process == False:
      response = jsonify(message = False, code = 200, data = "Verification code invalid")
      response.status_code = 200
    else:
      response = jsonify(message = True, code = 200, data = process)
    print(response)
    return response

@server.route("/auth/alert", methods = ['POST'])
@crossdomain(origin = "*")
def sendAlert():
    phone = request.form.get('phone')
    username = request.form.get('username')
    trial = request.form.get('trial')
    trial = int(trial)

    if (trial > 0):
      attempts = 3 - (trial - 1)
    else:
      attempts = 3

    auth.sendAlert(phone, username, attempts)
    response = jsonify(message = True, code = 200, data = "Access denied!")
    return response

@server.route("/user/scores", methods = ['POST'])
@crossdomain(origin = "*")
def setScores():
    id = request.form.get('id')
    ca1 = request.form.get('ca1')
    ca2 = request.form.get('ca2')
    ca3 = request.form.get('ca3')

    result = auth.setScores(id, ca1, ca2, ca3)
    print(result)

    if result == False:
        response = jsonify(message = False, code = 200, data = "User does not exist!")
    else:
        response = jsonify(message = True, code = 200, data = "Continuous Assessment scores set!")
    return response

@server.route("/username", methods = ['POST'])
@crossdomain(origin = "*")
def getUser():
    id = request.form.get('id')
    result = auth.getUser(id);

    if result == None:
        response = jsonify(message = False, code = 200, data = "User does not exist")
    else:
        data = { "name": result.name, "ca1": result.ca1, "ca2": result.ca2, "ca3": result.ca3 }
        response = jsonify(message = True, code = 200, data = data)
    return response

@server.route("/logs/list")
@crossdomain(origin = "*")
def getLogs():
  process = auth.getLogs()
  print(process)
  response = jsonify(message = True, code = 200, data = process)
  response.status_code = 200
  return response

if __name__ == '__main__':
  server.run('0.0.0.0', port = 9090, debug = True)
