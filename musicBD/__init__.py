from flask import Flask, request, render_template
from flaskext.mysql import MySQL
import pymysql

app = Flask(__name__)
app.config['MYSQL_DATABASE_USER'] = 'root'
app.config['MYSQL_DATABASE_PASSWORD'] = '19283sieben'
app.config['MYSQL_DATABASE_DB'] = 'music_db'
app.config['MYSQL_DATABASE_HOST'] = 'localhost'

mysql = MySQL()
connection = mysql.connect()
cursor = connection.cursor()

@app.route('/')
@app.route('/index')
def index():
    return render_template("index.html")

@app.route('/make_request', methods = ['POST'])
def make_request():
    sql_request = request.form.get('request_text')
    cursor.execute(sql_request)
    request_result = cursor.fetchall()
    result_headers = [description[0] for description in request_result.description]
    resut_headers_tuple = tuple(result_headers)
    fetched_result = request_result.fetchall()
    fetched_result.insert(0, resut_headers_tuple)
    return fetched_result