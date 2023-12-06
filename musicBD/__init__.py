from flask import Flask, request, render_template
from flaskext.mysql import MySQL

import os
import sys

from user_module import user_handler, alphabet
from request_module import request_handler
from render_module import renderer

file_dir = os.path.dirname(__file__)
sys.path.append(file_dir)

uh = user_handler()
rh = request_handler()
r = renderer()

app = Flask(__name__)
mysql = MySQL()

app.config['MYSQL_DATABASE_USER'] = 'guest'
app.config['MYSQL_DATABASE_DB'] = 'music_db'
app.config['MYSQL_DATABASE_HOST'] = 'localhost'

mysql.init_app(app)


@app.route('/')
@app.route('/login')
def login():    
    return r.login()

@app.route('/index')
def index():
    return r.index()

@app.route('/make_request', methods = ['POST'])
def make_request():
    return r.make_request()
    

@app.route('/push', methods = ['POST'])
def push():
    return rh.push(request.form.get('user'), request.form.get('request_text'))

@app.route('/tryLogIn', methods = ['POST'])
def try_login():    
    return r.try_login() 
    
@app.route('/register', methods = ['POST'])
def register():
    login = request.form.get('login')
    password1 = request.form.get('password1')
    password2 = request.form.get('password2')

    if login == '' or password1 == '' or password2 == '':
        return render_template('login.html', error = 'not filled')

    if password1 != password2:
        return render_template('login.html', error = 'different passwords')
    
    if len(login) >= 40:
        return render_template('login.html', error = 'login too long')

    if len(password1) >= 40:
            return render_template('login.html', error = 'password too long')
    
    if not uh.check_string(login, alphabet):
        return render_template('login.html', error = 'login has invalid chars')

    res = uh.register(login, password1)
    if res:
        return r.registered(login)

    return res

@app.route('/add_survey', methods = ['POST'])
def add_survey():
    rh.add_survey(request.get_json())
    return r.survey_added(login)