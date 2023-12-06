from flask import request, render_template
from request_module import request_handler
from user_module import user_handler, alphabet

rh = request_handler()
uh = user_handler()

class renderer:
    def login(self):
        return render_template("login.html")
    
    def index(self):
        return render_template("index.html", user = 'manager')
    
    def make_request(self):
        sql_request = request.form.get('request_text')
        user = request.form.get('user')
        return rh.get_request_data(sql_request, user)
    
    def try_login(self):
        login = request.form.get('login')
        password = request.form.get('password')

        if len(login) >= 40 or len(password) >= 40 or not uh.check_string(login, alphabet):
            return render_template('login.html', error = 'invalid login')  
        
        if uh.check_login_info(login, password):
            return render_template('index.html', user = login, survey = uh.check_survey(login))
        
        else:
            return render_template('login.html', error = 'invalid login') 

    def registered(self, login):
        return render_template('index.html', user = login, survey = False)
         
    def survey_added(self, login):
        return render_template('index.html', user = login, survey = True)
