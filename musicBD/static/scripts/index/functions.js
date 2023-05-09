function tryAdingEventListener(elementId, func){
    var element = document.getElementById(elementId);
    if (element != null){
        element.addEventListener(
            "click",
            function() {
                func();        
            },
            false    
        );
    }
}

async function makeAsyncRequest(request, userName, returningFunc){
    const result = $.ajax({
        method: "POST",
        url: "/make_request",
        data: {
            request_text: request,
            user: userName
        },
        success: returningFunc
    });

    return result;
}

async function push(request, user_name){
    $.ajax({
        method: "POST",
        url: "/push",
        data: {
            request_text: request,
            user: user_name
        },                                     
    });
}

$(document).ready(function(){
    $('select').select2({
        width: '350px',
        theme: 'dark'
    });
});


function selectField(containerName){
    if (fields.includes(containerName)){
        for (var i = 0; i < fields.length; ++i){
            var element =  document.getElementById(fields[i]);
            if (element != null){
                element.style = "z-index: -1";
            }
        }        
        var element = document.getElementById(containerName);
        if (element != null){
            element.style = "z-index: -1";
        }
        element.style = "z-index: 1";
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

function makeRequest(request, user_name){
    $.ajax({
        method: "POST",
        url: "/make_request",
        data: {
            request_text: request,
            user: user_name
        },
        success: function(result){  
            var text = convertToTableText(result);

            document.getElementById("requestResult").innerHTML = text;
            document.getElementById("requestName").innerHTML = request;

            selectField("tableContainer");
        }
    });
}

function checkLine(line, alphabet){
    for (var i = 0; i < line.length; ++i) {
        if (alphabet.search(line.charAt(i)) == -1){
            return false;
        }
    }
    return true;
}