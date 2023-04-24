document.getElementById("logInSelectorButton").addEventListener(
    "click",
    function() {
        showLogIn(true);      
    },
    false    
);

document.getElementById("signUpSelectorButton").addEventListener(
    "click",
    function() {
        showLogIn(false);               
    },
    false    
);

function showLogIn(isOn){
    if (isOn){
        document.getElementById("signUpField").style = "z-index: -1";
        document.getElementById("logInField").style = "z-index: 1";
    }
    else{
        document.getElementById("signUpField").style = "z-index: 1"; 
        document.getElementById("logInField").style = "z-index: -1"; 
    }
}