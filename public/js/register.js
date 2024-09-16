document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('register-form').addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent the default form submission

        let formData = new FormData(this);

        fetch('/register', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            const messageDiv = document.getElementById('message');
            if (data.success) {
                messageDiv.innerHTML = `<p class="green-text">${data.message}</p>`;
                // setTimeout(() => {
                //     window.location.href = '/profile'; // Redirect to profile after successful registration
                // }, 1000);
            } else {
                messageDiv.innerHTML = `<p class="red-text">${data.message}</p>`;
            }
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('message').innerHTML = '<p class="red-text">An error occurred</p>';
        });
    });
});
