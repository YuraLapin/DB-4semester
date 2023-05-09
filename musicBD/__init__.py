from flask import Flask, request, render_template
from flaskext.mysql import MySQL
from flaskext.mysql import pymysql
import bcrypt

app = Flask(__name__)
mysql = MySQL()

app.config['MYSQL_DATABASE_USER'] = 'guest'
app.config['MYSQL_DATABASE_DB'] = 'music_db'
app.config['MYSQL_DATABASE_HOST'] = 'localhost'

mysql.init_app(app)

def get_hash(password):
    return bcrypt.hashpw(password, bcrypt.gensalt())

def check_survey(login):
    connection = 1
    cursor = 1

    if login == 'admin':
        connection = pymysql.connect(
            host='localhost',
            user='root',
            password='adminpassword192837', 
            db='music_db',
        )
        cursor = connection.cursor()

    elif login == 'manager':
        connection = pymysql.connect(
            host='localhost',
            user='manager',
            password='managerpassword192837', 
            db='music_db',
        )
        cursor = connection.cursor()

    else:
        connection = pymysql.connect(
            host='localhost',
            user='guest',
            db='music_db',
        )
        cursor = connection.cursor()

    sql_request = 'SELECT id_respondent FROM user WHERE login=\'' + login + '\''
    cursor.execute(sql_request)

    cursor.close()
    connection.close()

    request_result = cursor.fetchall()
    if request_result[0][0] == None:
        return False
    return True

def get_request_data(sql_request, user):
    connection = 1
    cursor = 1

    if user == 'admin':
        connection = pymysql.connect(
            host='localhost',
            user='root',
            password='adminpassword192837', 
            db='music_db',
        )
        cursor = connection.cursor()

    elif user == 'manager':
        connection = pymysql.connect(
            host='localhost',
            user='manager',
            password='managerpassword192837', 
            db='music_db',
        )
        cursor = connection.cursor()

    else:
        connection = pymysql.connect(
            host='localhost',
            user='guest',
            db='music_db',
        )
        cursor = connection.cursor()

    cursor.execute(sql_request)

    cursor.close()
    connection.close()

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

def check_login_info(login, password):    
    connection = pymysql.connect(
        host='localhost',
        user='guest', 
        db='music_db',
    )
    cursor = connection.cursor()

    sql_request = 'SELECT password FROM user WHERE login=\'' + login + '\''
    cursor.execute(sql_request)

    cursor.close()
    connection.close()

    request_result = cursor.fetchall()

    if len(request_result) == 0:
        return False    
    
    hashed_password = request_result[0][0]    
    if bcrypt.checkpw(password, hashed_password):        
        return True 
    
    return False

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
    user = request.form.get('user')
    return get_request_data(sql_request, user)

@app.route('/push', methods = ['POST'])
def push():
    connection = 1
    cursor = 1
    user = request.form.get('user')

    try:
        if user == 'admin':
            connection = pymysql.connect(
            host='localhost',
            user='root',
            password='adminpassword192837', 
            db='music_db',
            )
            cursor = connection.cursor()

        elif user == 'manager':
            connection = pymysql.connect(
            host='localhost',
            user='manager',
            password='managerpassword192837', 
            db='music_db',
            )
            cursor = connection.cursor()

        else:
            connection = pymysql.connect(
            host='localhost',
            user='guest',
            db='music_db',
            )
            cursor = connection.cursor()

        sql_request = request.form.get('request_text')
        # print(sql_request)
        cursor.execute(sql_request)

    except pymysql.err.ProgrammingError:
        return 'programming error', 400
    
    except pymysql.err.DataError:
        return 'data error', 400
    
    except pymysql.err.NotSupportedError:
        return 'not supported error', 400
    
    except pymysql.err.OperationalError:
        return 'operational error', 400
    
    connection.commit()

    cursor.close()
    connection.close()

    return '', 204

@app.route('/tryLogIn', methods = ['POST'])
def try_login():    
    login = request.form.get('login')
    password = request.form.get('password')
    if check_login_info(login, password):
        return render_template('index.html', user = login, survey = check_survey(login))
    else:
        return render_template('login.html', error = 'invalid login')   
    
@app.route('/register', methods = ['POST'])
def register():
    login = request.form.get('login')
    password1 = request.form.get('password1')
    password2 = request.form.get('password2')

    if login == '' or password1 == '' or password2 == '':
        return render_template('login.html', error = 'not filled')

    if password1 != password2:
        return render_template('login.html', error = 'different passwords')
    
    connection = pymysql.connect(
        host='localhost',
        user='guest', 
        db='music_db',
    )
    cursor = connection.cursor()
    
    sql_request = 'SELECT * FROM user WHERE login=\'' + login + '\''
    cursor.execute(sql_request)

    request_result = cursor.fetchall()
    if len(request_result) > 0:
        cursor.execute(sql_request)
        connection.commit()  
        return render_template('login.html', error = 'login taken')    
    
    hashed_password = get_hash(password1)
    sql_request = 'INSERT INTO user (login, password) VALUES (\"' + login + '\", \"' + str(hashed_password) + '\")'
    cursor.execute(sql_request)
    connection.commit()  

    cursor.close()
    connection.close()   

    return render_template('index.html', user = login, survey = False)

@app.route('/add_survey', methods = ['POST'])
def add_survey():
    fetched_request = request.get_json()
    login = fetched_request['login']
    name = fetched_request['name']
    age = fetched_request['age']
    gender = fetched_request['gender']
    song_id1 = fetched_request['songId1']
    song_id2 = fetched_request['songId2']
    song_id3 = fetched_request['songId3']
    song_id4 = fetched_request['songId4']
    song_id5 = fetched_request['songId5']

    connection = 1
    cursor = 1

    if login == 'admin':
        connection = pymysql.connect(
        host='localhost',
        user='root',
        password='adminpassword192837', 
        db='music_db',
        )
        cursor = connection.cursor()

    elif login == 'manager':
        connection = pymysql.connect(
        host='localhost',
        user='manager',
        password='managerpassword192837', 
        db='music_db',
        )
        cursor = connection.cursor()

    else:
        connection = pymysql.connect(
        host='localhost',
        user='guest',
        db='music_db',
        )
        cursor = connection.cursor()

    request_text = "SELECT id_category FROM category WHERE minimal_age <= " + str(age) + " AND maximal_age >= " + str(age) + " AND gender = " + str(gender)
    category_id = get_request_data(request_text, login)[1][0]

    request_text = "INSERT INTO respondent (id_category, respondent_name) VALUES (" + str(category_id) + ", \"" + name + "\")"
    cursor.execute(request_text)
    connection.commit()

    request_text = "SELECT LAST_INSERT_ID();"
    cursor.execute(request_text)
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
    fetched_result
    respondent_id = fetched_result[1][0]

    request_text = "INSERT INTO survey (id_song, id_respondent, song_rating) VALUES (" + str(song_id1) + ", " + str(respondent_id) + ", 5);"
    cursor.execute(request_text)
    request_text = "INSERT INTO survey (id_song, id_respondent, song_rating) VALUES (" + str(song_id2) + ", " + str(respondent_id) + ", 4);"
    cursor.execute(request_text)
    request_text = "INSERT INTO survey (id_song, id_respondent, song_rating) VALUES (" + str(song_id3) + ", " + str(respondent_id) + ", 3);"
    cursor.execute(request_text)
    request_text = "INSERT INTO survey (id_song, id_respondent, song_rating) VALUES (" + str(song_id4) + ", " + str(respondent_id) + ", 2);"
    cursor.execute(request_text)
    request_text = "INSERT INTO survey (id_song, id_respondent, song_rating) VALUES (" + str(song_id5) + ", " + str(respondent_id) + ", 1);"
    cursor.execute(request_text)
    connection.commit()

    request_text = "UPDATE user SET id_respondent = " + str(respondent_id) + " WHERE (login = \"" + str(login) + "\");"
    cursor.execute(request_text)
    connection.commit()

    cursor.close()
    connection.close()

    return render_template('index.html', user = login, survey = True)