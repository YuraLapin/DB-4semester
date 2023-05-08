var userName = document.getElementById("loginData").value;

for (var i = 0; i < 8; ++i){
    let id = i;
    let strId = "request" + id.toString();
    document.getElementById(strId).addEventListener(
        "click",
        function() {
            makeAsyncRequest(
                requests[id],
                userName,
                function(result){  
                    var text = convertToTableText(result);
        
                    document.getElementById("requestResult").innerHTML = text;
                    document.getElementById("requestName").innerHTML = requests[id];
        
                    selectField("tableContainer");
                }    
            );               
        },
        false    
    );
}

tableNames.forEach(element => {
    let strId = element + "Button";
    let request = "SELECT * FROM " + element;
    document.getElementById(strId).addEventListener(
        "click",
        function() {
            makeAsyncRequest(
                request,
                userName,
                function(result){  
                    var text = convertToTableText(result);
        
                    document.getElementById("requestResult").innerHTML = text;
                    document.getElementById("requestName").innerHTML = request;
        
                    selectField("tableContainer");
                }
            );               
        },
        false    
    );
}); 

document.getElementById("mainSurveyButton").addEventListener(
    "click",
    async function() {
        var res = await makeAsyncRequest(
            "SELECT song.id_song, song.song_name, band.band_name FROM song INNER JOIN album ON song.id_album = album.id_album INNER JOIN band ON album.id_band = band.id_band;",
            userName,
            async function(result){ 
                var songList = result;
                songList.shift();
                var htmlSongList = "<option value=\"\" disabled selected hidden>Song name</option>";
                songList.forEach(element => {      
                    htmlSongList += "<option value=\"" + element[0] + "\">" + element[1] + " by " + element[2] + "</option>";
                });
                for (var i = 0; i < 5; ++i){
                    let strId = "surveySelect" + i.toString();
                    document.getElementById(strId).innerHTML = htmlSongList;
                }
            }
        );
        selectField("surveyContainer");         
    },
    false    
);

tryAdingEventListener("sqlQueryButton",
    function() {
        selectField("adminContainer");         
});

tryAdingEventListener("managerButtonSong",
    async function() {
        var res = await makeAsyncRequest(
            "SELECT album.id_album, album.album_name, band.band_name FROM album INNER JOIN band ON album.id_band = band.id_band;",
            userName,
            async function(result){                 
                var rawList = result;
                rawList.shift();
                var htmlList = "<option value=\"\" disabled selected hidden>Album name</option>";
                rawList.forEach(element => {      
                    htmlList += "<option value=\"" + element[0] + "\">" + element[1] + " by " + element[2] + "</option>";
                });
                document.getElementById("albumSelect").innerHTML = htmlList;
            }
        );

        res = await makeAsyncRequest(
            "SELECT genre.id_genre, genre.genre_name FROM genre;",
            userName,
            async function(result){ 
                var rawList = result;
                rawList.shift();
                var htmlList = "<option value=\"\" disabled selected hidden>Genre name</option>";
                rawList.forEach(element => {      
                    htmlList += "<option value=\"" + element[0] + "\">" + element[1] + "</option>";
                });
                document.getElementById("genreSelect").innerHTML = htmlList;
            }
        );

        selectField("managerContainerSong");         
    }
);

tryAdingEventListener("managerButtonAlbum",
    async function() {
        var res = await makeAsyncRequest(
            "SELECT band.id_band, band.band_name FROM band;",
            userName,
            async function(result){                 
                var rawList = result;
                rawList.shift();
                var htmlList = "<option value=\"\" disabled selected hidden>Band name</option>";
                rawList.forEach(element => {      
                    htmlList += "<option value=\"" + element[0] + "\">" + element[1] + "</option>";
                });
                document.getElementById("bandSelect").innerHTML = htmlList;
            }
        );
        selectField("managerContainerAlbum");         
    }
);

tryAdingEventListener("managerButtonBand", function() {
    selectField("managerContainerBand");         
});

tryAdingEventListener("managerButtonGenre", function() {
    selectField("managerContainerGenre");         
});

tryAdingEventListener("songAddButton",
    function() {
        var songName = document.getElementById("songNameTextArea").value; 
        if (songName == ""){
            document.getElementById("songErrorMessage").innerHTML = "Name field is empty";
            document.getElementById("songErrorMessage").removeAttribute("hidden");
            return;
        }
        
        var songDuration = document.getElementById("songDurationTextArea").value
        if (songDuration == ""){
            document.getElementById("songErrorMessage").innerHTML = "Duration field is empty";  
            document.getElementById("songErrorMessage").removeAttribute("hidden");
            return;              
        }

        var songDurationParsed = parseInt(songDuration)
        if (isNaN(songDurationParsed)){
            document.getElementById("songErrorMessage").innerHTML = "Invalid duration";     
            document.getElementById("songErrorMessage").removeAttribute("hidden");
            return;              
        }  
        
        if (songDurationParsed <= 0){
            document.getElementById("songErrorMessage").innerHTML = "Invalid duration";     
            document.getElementById("songErrorMessage").removeAttribute("hidden");
            return;              
        }  
        
        var albumId = document.getElementById("albumSelect").value;
        if (albumId == ""){
            document.getElementById("songErrorMessage").innerHTML = "Choose album";     
            document.getElementById("songErrorMessage").removeAttribute("hidden");
            return;  
        }

        var genreId = document.getElementById("genreSelect").value;
        if (genreId == ""){
            document.getElementById("songErrorMessage").innerHTML = "Choose genre";     
            document.getElementById("songErrorMessage").removeAttribute("hidden");
            return;  
        }

        var request = "INSERT INTO song (id_album, id_genre, song_name, duration) VALUES (" + albumId.toString() + ", " + genreId.toString() + ", \"" + songName + "\", " + songDurationParsed.toString() + ")";
        document.getElementById("songErrorMessage").setAttribute("hidden", true);

        $.ajax({
            method: "POST",
            url: "/push",
            data: {
                request_text: request,
                user: userName
            },            
        });
    }
);


tryAdingEventListener("albumAddButton",
    function() {
        var albumName = document.getElementById("albumNameTextArea").value; 
        if (albumName == ""){
            document.getElementById("albumErrorMessage").innerHTML = "Name field is empty";
            document.getElementById("albumErrorMessage").removeAttribute("hidden");
            return;
        }
        
        var albumYear = document.getElementById("albumYearTextArea").value
        if (albumYear == ""){
            document.getElementById("albumErrorMessage").innerHTML = "Release year field is empty";  
            document.getElementById("albumErrorMessage").removeAttribute("hidden");
            return;              
        }

        var albumYearParsed = parseInt(albumYear)
        if (isNaN(albumYearParsed)){
            document.getElementById("albumErrorMessage").innerHTML = "Invalid year";     
            document.getElementById("albumErrorMessage").removeAttribute("hidden");
            return;              
        }  
        
        if (albumYearParsed <= 0){
            document.getElementById("albumErrorMessage").innerHTML = "Invalid year";     
            document.getElementById("albumErrorMessage").removeAttribute("hidden");
            return;              
        }  
        
        var bandId = document.getElementById("bandSelect").value;
        if (bandId == ""){
            document.getElementById("albumErrorMessage").innerHTML = "Choose band";     
            document.getElementById("albumErrorMessage").removeAttribute("hidden");
            return;  
        }        

        var request = "INSERT INTO album (id_band, album_name, release_year) VALUES (" + bandId.toString() + ", \"" + albumName + "\", " + albumYearParsed.toString() + ")";
        document.getElementById("albumErrorMessage").setAttribute("hidden", true);

        $.ajax({
            method: "POST",
            url: "/push",
            data: {
                request_text: request,
                user: userName
            },            
        });
    }
);

tryAdingEventListener("bandAddButton",
    function() {
        var bandName = document.getElementById("bandNameTextArea").value; 
        if (bandName == ""){
            document.getElementById("bandErrorMessage").innerHTML = "Name field is empty";
            document.getElementById("bandErrorMessage").removeAttribute("hidden");
            return;
        }
        
        var bandYear = document.getElementById("bandYearTextArea").value
        if (bandYear == ""){
            document.getElementById("bandErrorMessage").innerHTML = "Formation year field is empty";  
            document.getElementById("bandErrorMessage").removeAttribute("hidden");
            return;              
        }

        var bandYearParsed = parseInt(bandYear)
        if (isNaN(bandYearParsed)){
            document.getElementById("bandErrorMessage").innerHTML = "Invalid year";     
            document.getElementById("bandErrorMessage").removeAttribute("hidden");
            return;              
        }  
        
        if (bandYearParsed <= 0){
            document.getElementById("bandErrorMessage").innerHTML = "Invalid year";     
            document.getElementById("bandErrorMessage").removeAttribute("hidden");
            return;              
        }               

        var request = "INSERT INTO band (band_name, formation_year) VALUES (\"" + bandName + "\", " + bandYearParsed.toString() + ")";
        document.getElementById("bandErrorMessage").setAttribute("hidden", true);

        $.ajax({
            method: "POST",
            url: "/push",
            data: {
                request_text: request,
                user: userName
            },            
        });
    }
);

tryAdingEventListener("genreAddButton",
    function() {
        var genreName = document.getElementById("genreNameTextArea").value; 
        if (genreName == ""){
            document.getElementById("genreErrorMessage").innerHTML = "Name field is empty";
            document.getElementById("genreErrorMessage").removeAttribute("hidden");
            return;
        }                       

        var request = "INSERT INTO genre (genre_name) VALUES (\"" + genreName + "\")";
        document.getElementById("genreErrorMessage").setAttribute("hidden", true);

        $.ajax({
            method: "POST",
            url: "/push",
            data: {
                request_text: request,
                user: userName
            },            
        });
    }
);

tryAdingEventListener("queryExecuteButton",
    function() {
        document.getElementById("querySuccessMessage").setAttribute("hidden", true);

        var request = document.getElementById("queryTextArea").value; 
        if (request == ""){
            document.getElementById("queryErrorMessage").innerHTML = "Query is empty";
            document.getElementById("queryErrorMessage").removeAttribute("hidden");
            return;
        }                       

        var answer = $.ajax({
            method: "POST",
            url: "/push",
            data: {
                request_text: request,
                user: userName
            },                                     
        });

        answer.fail(function(jqXHR, textStatus, errorThrown) {
            if(jqXHR.status !== 204) {
                document.getElementById("queryErrorMessage").innerHTML = jqXHR.responseText;
                document.getElementById("queryErrorMessage").removeAttribute("hidden");
               return;
            }
        });

        document.getElementById("queryErrorMessage").setAttribute("hidden", true);
        document.getElementById("querySuccessMessage").innerHTML = request + "\nCompleted successfully";
        document.getElementById("querySuccessMessage").removeAttribute("hidden");
    }
);

tryAdingEventListener("surveySendButton",
    async function() {    
        document.getElementById("surveySuccessMessage").setAttribute("hidden", true);

        var age = document.getElementById("surveyAgeTextArea").value; 
        if (age == ""){
            document.getElementById("surveyErrorMessage").innerHTML = "Age field is empty";
            document.getElementById("surveyErrorMessage").removeAttribute("hidden");
            return;
        }   
        
        var ageParsed = parseInt(age)
        if (isNaN(ageParsed)){
            document.getElementById("surveyErrorMessage").innerHTML = "Invalid age";     
            document.getElementById("surveyErrorMessage").removeAttribute("hidden");
            return;              
        }  
        
        if (ageParsed <= 0){
            document.getElementById("surveyErrorMessage").innerHTML = "Invalid age";     
            document.getElementById("surveyErrorMessage").removeAttribute("hidden");
            return;              
        } 

        if (ageParsed >= 999){
            document.getElementById("surveyErrorMessage").innerHTML = "Invalid age";     
            document.getElementById("surveyErrorMessage").removeAttribute("hidden");
            return;              
        } 

        var gender = document.getElementById("surveySelectGender").value; 
        if (gender == ""){
            document.getElementById("surveyErrorMessage").innerHTML = "Choose gender";
            document.getElementById("surveyErrorMessage").removeAttribute("hidden");
            return;
        } 

        var songId1 = document.getElementById("surveySelect0").value; 
        if (songId5 == ""){
            document.getElementById("surveyErrorMessage").innerHTML = "Choose all 5 songs";
            document.getElementById("surveyErrorMessage").removeAttribute("hidden");
            return;
        } 
        
        var songId2 = document.getElementById("surveySelect1").value; 
        if (songId5 == ""){
            document.getElementById("surveyErrorMessage").innerHTML = "Choose all 5 songs";
            document.getElementById("surveyErrorMessage").removeAttribute("hidden");
            return;
        }  

        var songId3 = document.getElementById("surveySelect2").value; 
        if (songId5 == ""){
            document.getElementById("surveyErrorMessage").innerHTML = "Choose all 5 songs";
            document.getElementById("surveyErrorMessage").removeAttribute("hidden");
            return;
        }  

        var songId4 = document.getElementById("surveySelect3").value; 
        if (songId5 == ""){
            document.getElementById("surveyErrorMessage").innerHTML = "Choose all 5 songs";
            document.getElementById("surveyErrorMessage").removeAttribute("hidden");
            return;
        }  

        var songId5 = document.getElementById("surveySelect4").value; 
        if (songId5 == ""){
            document.getElementById("surveyErrorMessage").innerHTML = "Choose all 5 songs";
            document.getElementById("surveyErrorMessage").removeAttribute("hidden");
            return;
        }  

        var songIds = new Set();
        songIds.add(songId1);
        songIds.add(songId2);
        songIds.add(songId3);
        songIds.add(songId4);
        songIds.add(songId5);
        if (songIds.size < 5){
            document.getElementById("surveyErrorMessage").innerHTML = "Songs must be different";
            document.getElementById("surveyErrorMessage").removeAttribute("hidden");
            return;
        }

        fetch("/add_survey", {
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'login': userName,
                'age': ageParsed,
                'gender': gender,
                'songId1': songId1,
                'songId2': songId2,
                'songId3': songId3,
                'songId4': songId4,
                'songId5': songId5,
            }),            
        });

        document.getElementById("surveyErrorMessage").setAttribute("hidden", true);
        document.getElementById("surveySuccessMessage").innerHTML = "Your response has been saved. Thank you!";
        document.getElementById("surveySuccessMessage").removeAttribute("hidden");
        document.getElementById("surveySendButton").setAttribute("hidden", true);
    }
);