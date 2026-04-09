document.addEventListener('DOMContentLoaded', () => {
    // Setup dynamic Toast Container
    let toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toast-container';
        toastContainer.setAttribute('aria-live', 'polite');
        document.body.appendChild(toastContainer);
    }

    function showToast(message, type = 'error') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerText = message;
        toastContainer.appendChild(toast);
        
        // Trigger reflow & show
        requestAnimationFrame(() => {
            toast.classList.add('show');
        });

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 5000);
    }

    if (seminarForm) {
        seminarForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const submitBtn = seminarForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;

            // 1. Honeypot check
            const honeypot = document.getElementById('honeypot').value;
            if (honeypot) {
                console.log('Spam detected via honeypot.');
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<span class="spinner"></span> Processing...';
                setTimeout(() => {
                    window.location.href = '/ceo-ai-forum-thankyou.html';
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

            // UX: Lock button and show spinner
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="spinner"></span> Submitting...';

            // 3. Submit to API
            try {
                const response = await fetch('/api/ceo-ai-forum/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                if (response.ok) {
                    showToast('Registration successful! Redirecting...', 'success');
                    setTimeout(() => window.location.href = '/ceo-ai-forum-thankyou.html', 800);
                } else if (response.status === 429) {
                    const limitData = await response.json().catch(() => ({}));
                    const msg = limitData.detail || 'Too many attempts. Please try again in 10 minutes.';
                    showToast(msg, 'rate-limit');
                } else if (response.status === 400) {
                    const errorData = await response.json();
                    
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
                    } else if (errorData.detail) {
                        showToast(errorData.detail, 'error');
                    } else {
                        showToast('There was an error with your registration. Please verify your information.', 'error');
                    }
                } else {
                    showToast('An unexpected error occurred. Please try again later.', 'error');
                }
            } catch (error) {
                console.error('Network error:', error);
                showToast('Could not connect to server. (Check CORS/Network)', 'error');
            } finally {
                // Restore button state if not redirecting successfully
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
            }
        });
    }
});
