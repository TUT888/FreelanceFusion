// document.addEventListener('DOMContentLoaded', function() {
//     document.getElementById('register-form').addEventListener('submit', function(event) {
//         event.preventDefault(); // Prevent the default form submission

//         let formData = new FormData(this);

//         fetch('/register', {
//             method: 'POST',
//             body: formData,
//             headers: {
//                 'Accept': 'application/json',
//             },
//         })
//         .then(response => response.json())
//         .then(data => {
//             const messageDiv = document.getElementById('message');
//             if (data.success) {
//                 messageDiv.innerHTML = `<p class="green-text">${data.message}</p>`;
//                 // Optionally redirect after successful registration
//                 // setTimeout(() => {
//                 //     window.location.href = '/profile';
//                 // }, 1000);
//             } else {
//                 messageDiv.innerHTML = `<p class="red-text">${data.message}</p>`;
//             }
//         })
//         .catch(error => {
//             console.error('Error:', error);
//             document.getElementById('message').innerHTML = '<p class="red-text">An error occurred</p>';
//         });
//     });
// });



$(document).ready(function () {
    // Handle form submission
    $("#register-form").submit(function (e) {
        e.preventDefault(); // Prevent the default form submission

        const formData = {
            email: $('#email').val(),
            password: $('#password').val(),
            username: $('#username').val()
        };

        $.ajax({
            url: '/register',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(formData),
            success: function (response) {
                if (response.success) {
                    $('#message').html(`<p class="green-text">${response.message}</p>`);
                    setTimeout(() => {
                        window.location.href = '/profile'; // Redirect to profile after successful registration
                    }, 3000);
                } else {
                    $('#message').html(`<p class="red-text">${response.message}</p>`);
                }
            },
            error: function () {
                $('#message').html('<p class="red-text">An error occurred</p>');
            }
        });
    });
});
