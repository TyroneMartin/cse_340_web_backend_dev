let password = document.getElementById("account_password");
let checkbox = document.getElementById("checkbox");

checkbox.onclick = function(){
    if (checkbox.checked) {
        password.type = "text";
    }else{
        password.type = "password";
    }
}