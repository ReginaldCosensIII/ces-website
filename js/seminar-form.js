document.addEventListener('DOMContentLoaded', () => {
    const seminarForm = document.getElementById('seminarForm');

    if (seminarForm) {
        seminarForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // 1. Honeypot check
            const honeypot = document.getElementById('honeypot').value;
            if (honeypot) {
                console.log('Spam detected via honeypot.');
                // Simulate delay to mimic processing
                setTimeout(() => {
                    window.location.href = '/seminar-thankyou.html';
                }, 1000);
                return;
            }

            // 2. Map payload
            const payload = {
                firstName: document.getElementById('firstName').value,
                lastName: document.getElementById('lastName').value,
                title: document.getElementById('title').value,
                company: document.getElementById('company').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                honeypot: honeypot
            };

            // 3. Submit to API
            try {
                const response = await fetch('/api/seminar/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                });

                if (response.ok) {
                    window.location.href = '/seminar-thankyou.html';
                } else if (response.status === 400) {
                    const errorData = await response.json();
                    
                    // Clear previous errors
                    document.querySelectorAll('.error-msg').forEach(e => e.remove());

                    if (errorData.errors) {
                        for (const [key, messages] of Object.entries(errorData.errors)) {
                            const domId = key.charAt(0).toLowerCase() + key.slice(1);
                            const inputField = document.getElementById(domId);
                            if (inputField) {
                                const errorDiv = document.createElement('div');
                                errorDiv.className = 'error-msg';
                                errorDiv.style.color = '#d9534f';
                                errorDiv.style.fontSize = '0.85rem';
                                errorDiv.style.marginTop = '4px';
                                errorDiv.innerText = messages[0];
                                inputField.parentNode.appendChild(errorDiv);
                            }
                        }
                    } else {
                        alert('There was an error with your registration. Please check your information and try again.');
                    }
                } else {
                    alert('An unexpected error occurred. Please try again later.');
                }
            } catch (error) {
                console.error('Network error:', error);
                alert('We are currently unable to process registrations. Please try again later.');
            }
        });
    }
});
