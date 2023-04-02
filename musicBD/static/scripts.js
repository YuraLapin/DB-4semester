requests = [
    "SELECT * FROM Songs",
    "",
    "",
    "",
    "",
    "",
    "",
    ""
];

tableNames = [
    "Artists",
    "Bands",
    "Albums",
    "Songs",
    "Genres",
    "Past_Surveys",
    "Former_Respondents",
    "Surveys",
    "Respondents",
    "Categories"
];

for (var i = 0; i < 8; ++i){
    let id = i;
    let strId = "request" + id.toString();
    document.getElementById(strId).addEventListener(
        "click",
        function() {
            makeRequest(requests[id]);               
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
            makeRequest(request);               
        },
        false    
    );
});  

document.getElementById("surveyButton").addEventListener(
    "click",
    function() {
        showRequest(false);         
    },
    false    
);

async function getSongNames(){
    const result = $.ajax({
        method: "POST",
        url: "/make_request",
        data: {
            request_text: "SELECT Song_name FROM Songs"
        },
        success: function(result){ 
            var songList = []; 
            songList = result;
            songList.shift();
            var htmlSongList = "";
            songList.forEach(element => {
                htmlSongList += "<option value=\"" + element + "\">" + element + "</option>";
            });
            for (var i = 0; i < 5; ++i){
                let strId = "surveySelect" + i.toString();
                document.getElementById(strId).innerHTML += htmlSongList;
            }
        }
    });

    return result;
}

async function prepareSelects(){
    var result = await getSongNames();
    $(document).ready(function () {
        $('select').selectize({
            sortField: 'text'
        });
    });
}

prepareSelects();

function showRequest(isOn){
    if (isOn){
        document.getElementById("requestLabel").hidden = false;
        document.getElementById("requestName").hidden = false;
        document.getElementById("requestResult").hidden = false;
        document.getElementById("surveyContainer").style = "z-index: -1";
    }
    else{
        document.getElementById("requestLabel").hidden = true;
        document.getElementById("requestName").hidden = true;
        document.getElementById("requestResult").hidden = true;
        document.getElementById("surveyContainer").style = "z-index: 2"; 
    }
}

function convertToTableText(list){
    var result = "";
    for (var i = 0; i < list.length; ++i){
        var currentRow = "";
        if (i == 0){
            currentRow = "<thead>"
        }
        else if (i == 1){
            var currentRow = "<tbody>";
        }
        currentRow += "<tr>";
        for (var j = 0; j < list[i].length; ++j){
            if (i == 0){
                currentRow += "<th>" + list[i][j] + "</th>";
            }
            else{
                currentRow += "<td>" + list[i][j] + "</td>";
            }
        }  
        currentRow += "</tr>";    
        if (i == 0){
            currentRow += "</thead>";                  
        }                                
        result += currentRow;
    }
    result += "</tbody>";
    return result;                
}

function makeRequest(request){
    $.ajax({
        method: "POST",
        url: "/make_request",
        data: {
            request_text: request
        },
        success: function(result){  
            var text = convertToTableText(result);

            document.getElementById("requestResult").innerHTML = text;
            document.getElementById("requestName").innerHTML = request;

            showRequest(true);
        }
    });
}