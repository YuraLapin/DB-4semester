from flaskext.mysql import pymysql

class request_handler:
    def get_request_data(self, sql_request, user):
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
    
    def push(self, user, sql_request):
        connection = 1
        cursor = 1

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

            cursor.execute(sql_request)

        except pymysql.err.ProgrammingError:
            return 'programming error', 400
        
        except pymysql.err.IntegrityError:
            return 'integrity error', 400
        
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
    
    def add_survey(self, fetched_request):
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
        categories = self.get_request_data(request_text, login)
        category_id = categories[len(categories) - 1][0]

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