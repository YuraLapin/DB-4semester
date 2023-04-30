from flask import Flask, request, render_template
from flaskext.mysql import MySQL
import bcrypt

app = Flask(__name__)
mysql = MySQL()

app.config['MYSQL_DATABASE_USER'] = 'root'
app.config['MYSQL_DATABASE_PASSWORD'] = '19283sieben'
app.config['MYSQL_DATABASE_DB'] = 'music_db'
app.config['MYSQL_DATABASE_HOST'] = 'localhost'

mysql.init_app(app)
connection = mysql.connect()
cursor = connection.cursor()

def get_hash(password):
    return bcrypt.hashpw(password, bcrypt.gensalt())

@app.route('/')
@app.route('/login')
def login():
    return render_template("login.html")

@app.route('/index')
def index():
    return render_template("index.html", user = 'manager')

@app.route('/make_request', methods = ['POST'])
def make_request():
    sql_request = request.form.get('request_text')
    cursor.execute(sql_request)
    request_result = cursor.fetchall()
    untrimmed_headers = cursor.description
    headers = []
    for header in untrimmed_headers:
        headers.append(header[0])
    fetched_result = []
    headers_tuple = tuple(headers)
    fetched_result.append(headers_tuple)
    for element in request_result:
        fetched_result.append(element)
    return fetched_result

@app.route('/tryLogIn', methods = ['POST'])
def try_login():
    login = request.form.get('login')
    password = request.form.get('password')

    sql_request = 'SELECT password FROM user WHERE login=\'' + login + '\''
    cursor.execute(sql_request)
    request_result = cursor.fetchall()
    if len(request_result) == 0:
        return render_template('login.html', error = 'invalid login')
    
    hashed_password = request_result[0][0]
    if bcrypt.checkpw(password, hashed_password):
        return render_template('index.html', user = login)
    else:
        return render_template('login.html', error = 'invalid login')
    
@app.route('/register', methods=['POST'])
def register():
    login = request.form.get('login')
    password1 = request.form.get('password1')
    password2 = request.form.get('password2')

    if login == '' or password1 == '' or password2 == '':
        return render_template('login.html', error = 'not filled')

    if password1 != password2:
        return render_template('login.html', error = 'different passwords')
    
    sql_request = 'SELECT * FROM user WHERE login=\'' + login + '\''
    cursor.execute(sql_request)
    request_result = cursor.fetchall()
    if len(request_result) > 0:
        return render_template('login.html', error = 'login taken')    
    
    hashed_password = get_hash(password1)
    sql_request = 'INSERT INTO user VALUES (\"' + login + '\", \"' + str(hashed_password) + '\")'
    cursor.execute(sql_request)
    connection.commit()
    return render_template('index.html')