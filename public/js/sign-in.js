// public/js/sign-in.js
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Materialize components
    M.updateTextFields(); // Ensure that Materialize text fields are initialized

    // Handle form submission
    document.getElementById('sign-in-form').addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent the default form submission

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                email: email,
                password: password,
            })
        })
        .then(response => response.json())
        .then(data => {
            const messageDiv = document.getElementById('message');
            if (data.success) {
                messageDiv.innerHTML = `<p class="green-text">${data.message}</p>`;
                setTimeout(() => {
                    window.location.href = '/profile'; // Redirect to profile page after successful login
                }, 3000);
            } else {
                messageDiv.innerHTML = `<p class="red-text">${data.message}</p>`;
            }
        })
        .catch(error => {
            console.log('Error:', error);
            console.error('Error:', error);
            document.getElementById('message').innerHTML = '<p class="red-text">An error occurred</p>';
        });
    });
});
