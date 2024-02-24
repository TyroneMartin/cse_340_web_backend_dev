const showPasswordCheck = document.getElementById('showPasswordCheck');
    const showPasswordText = document.getElementById('showPasswordText');

    showPasswordCheck.addEventListener('click', function(){
        const pswdInput = document.getElementById('password');
        const type = pswdInput.getAttribute('type');
        
        if (type === 'password' && showPasswordCheck.checked) {
            pswdInput.setAttribute('type', 'text');
            showPasswordText.innerHTML = 'Hide password';
        } else {
            pswdInput.setAttribute('type', 'password');
            showPasswordText.innerHTML = 'Show password';
        }
    });