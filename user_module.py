import bcrypt
from flaskext.mysql import pymysql
from flask import render_template
alphabet = "qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNMйцукенгшщзхъфывапролджэячсмитьбюёЙЦУКЕНГШЩЗХЪФЫВАПРОЛДЖЭЯЧСМИТЬБЮЁ1234567890 "

class user_handler:
    def check_string(self, string, alphabet):
        for symbol in string:
            if alphabet.find(symbol) < 0:
                return False
        return True

    def get_hash(self, password):
        return bcrypt.hashpw(password, bcrypt.gensalt())
    
    def check_login_info(self, login, password):    
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
    
    def check_survey(self, login):
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
    
    def register(self, login, password):
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
        
        hashed_password = self.get_hash(password)
        sql_request = 'INSERT INTO user (login, password) VALUES (\"' + login + '\", \"' + str(hashed_password) + '\")'
        cursor.execute(sql_request)
        connection.commit()  

        cursor.close()
        connection.close()   

        return True