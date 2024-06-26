let password = document.getElementById("account_password");
let checkbox = document.getElementById("showPasswordCheck");

checkbox.onclick = function(){
    if (checkbox.checked) {
        password.type = "text";
    }else{
        password.type = "password";
    }
}