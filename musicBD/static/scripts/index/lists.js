requests = [
    "SELECT band_name FROM band WHERE band.id_band NOT IN (SELECT DISTINCT band.id_band FROM band JOIN album ON album.id_band = band.id_band JOIN song ON song.id_album = album.id_album WHERE song.is_released)",
    "SELECT song.song_name, genre.genre_name, song.duration, album.album_name, band.band_name, SUM(survey.song_rating) as rating FROM song JOIN survey ON song.id_song = survey.id_song JOIN genre ON genre.id_genre = song.id_genre JOIN album ON album.id_album = song.id_album JOIN band ON band.id_band = album.id_band GROUP BY song.song_name, genre.genre_name, song.duration, album.album_name, band.band_name ORDER BY rating DESC",
    "SELECT artist.artist_name, band.band_name, artist.nickname, artist.origin_year, SUM(survey.song_rating) AS song_rating FROM artist JOIN band ON band.id_band = artist.id_band JOIN album ON album.id_band = band.id_band JOIN song ON song.id_album = album.id_album JOIN survey ON survey.id_song = song.id_song GROUP BY artist.artist_name, band.band_name, artist.nickname, artist.origin_year ORDER BY song_rating DESC",
    "SELECT genre.genre_name, SUM(survey.song_rating) as rating FROM survey JOIN song ON song.id_song = survey.id_song JOIN genre ON genre.id_genre = song.id_genre JOIN respondent ON respondent.id_respondent = survey.id_respondent JOIN category ON category.id_category = respondent.id_category WHERE category.minimal_age >= 0 AND category.maximal_age <=18 AND category.gender = 1 GROUP BY genre.genre_name ORDER BY rating DESC",
    "SELECT category.minimal_age, category.maximal_age, category.gender, COUNT(*) AS count FROM respondent JOIN category ON category.id_category = respondent.id_category GROUP BY category.minimal_age, category.maximal_age, category.gender",
    "SELECT song.song_name, song.duration, genre.genre_name, album.album_name, band.band_name FROM song JOIN genre ON genre.id_genre = song.id_genre JOIN album ON album.id_album = song.id_album JOIN band ON band.id_band = album.id_band WHERE song.id_song NOT IN (SELECT survey.id_song FROM survey)",
    "SELECT song.song_name, genre.genre_name, song.duration, album.album_name, band.band_name, respondent.id_category, SUM(survey.song_rating) as rating FROM song JOIN survey ON song.id_song = survey.id_song JOIN genre ON genre.id_genre = song.id_genre JOIN album ON album.id_album = song.id_album JOIN band ON band.id_band = album.id_band JOIN respondent ON respondent.id_respondent = survey.id_respondent INNER JOIN (SELECT category.id_category, COUNT(*) AS count FROM respondent JOIN category ON category.id_category = respondent.id_category GROUP BY category.id_category ORDER BY count DESC LIMIT 1) AS most_popular_category ON respondent.id_category = most_popular_category.id_category GROUP BY song.song_name, genre.genre_name, song.duration, album.album_name, band.band_name, respondent.id_category ORDER BY rating DESC",
    "SELECT song.song_name, genre.genre_name, song.duration, album.album_name, band.band_name, SUM(survey.song_rating) AS rating FROM survey JOIN song ON song.id_song = survey.id_song JOIN genre ON genre.id_genre = song.id_genre JOIN album ON album.id_album = song.id_album JOIN band ON band.id_band = album.id_band JOIN respondent ON respondent.id_respondent = survey.id_respondent JOIN category ON category.id_category = respondent.id_category WHERE category.minimal_age >= 18 AND category.maximal_age <=31 AND category.gender = 0 GROUP BY song.song_name, genre.genre_name, song.duration, album.album_name, band.band_name ORDER BY rating DESC"
];

tableNames = [
    "artist",
    "band",
    "album",
    "song",
    "genre",
    "past_survey",
    "former_respondent",
    "survey",
    "respondent",
    "category"
];

fields = [
    "surveyContainer",
    "tableContainer",
    "adminContainer",
    "managerContainerSong",
    "managerContainerAlbum",
    "managerContainerBand",
    "managerContainerGenre",
    "managerContainerArtist"
];

descriptions = [
    "Вывести группы, песни которых еще не появлялись на пластинках",
    "Вывести данные о лучших песнях",
    "Вывести информацию об участниках группы, песни которой имеют наибольший средний рейтинг",
    "Вывести жанры, наиболее популярные у девочек до 18 лет",
    "Вывести информацию о категориях людей и количестве людей, входящих в эти категории",
    "Вывести информацию о всех песнях, которые не были выбраны никем",
    "Вывести информацию о песнях, наиболее популярных среди самой многочисленной группы людей",
    "Вывести информацию о песнях, наиболее популярных у мужчин от 19 до 31 года"
];

alphabet = "qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNMйцукенгшщзхъфывапролджэячсмитьбюёЙЦУКЕНГШЩЗХЪФЫВАПРОЛДЖЭЯЧСМИТЬБЮЁ1234567890 "