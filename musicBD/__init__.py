import sqlite3
from flask import Flask, request, render_template, g

app = Flask(__name__)

@app.route('/')
@app.route('/index')
def index():
    return render_template("index.html")

DATABASE = 'musicBD/db/database.db'

def get_db():
    db = getattr(g, '_database', None)
    if db is None:
        db = g._database = sqlite3.connect(DATABASE)
    return db

@app.teardown_appcontext
def close_connection(exception):
    db = getattr(g, '_database', None)
    if db is not None:
        db.close()

@app.route('/make_request', methods = ['POST'])
def make_request():
    db = get_db()
    sql_request = request.form.get('request_text')
    request_result = db.execute(sql_request)
    result_headers = [description[0] for description in request_result.description]
    resut_headers_tuple = tuple(result_headers)
    fetched_result = request_result.fetchall()
    fetched_result.insert(0, resut_headers_tuple)
    return fetched_result