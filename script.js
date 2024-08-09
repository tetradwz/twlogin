document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const error = urlParams.get('error');
    const loginMessage = document.getElementById('login-message');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    if (error) {
        if (error === 'invalidcredentials') {
            loginMessage.textContent = 'Hatalı kullanıcı adı veya şifre.';
        } else if (error === 'emptyfields') {
            loginMessage.textContent = 'Tüm alanları doldurun.';
        }
    }

    document.getElementById('register-btn').addEventListener('click', function() {
        loginForm.classList.add('hidden');
        registerForm.classList.remove('hidden');
    });

    document.getElementById('back-to-login').addEventListener('click', function() {
        registerForm.classList.add('hidden');
        loginForm.classList.remove('hidden');
    });
});
