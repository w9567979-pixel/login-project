// Get the form and elements
const loginForm = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const loginBtn = document.getElementById('loginBtn');
const errorMessage = document.getElementById('errorMessage');

// ⚠️ MAKE SURE THIS URL IS CORRECT ⚠️
const BACKEND_URL = 'https://login-project-twak.onrender.com/api/login';

// Handle form submission
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    
    if (!email || !password) {
        showError('Please fill in all fields');
        return;
    }
    
    loginBtn.textContent = 'Logging in...';
    loginBtn.disabled = true;
    clearError();
    
    try {
        // Send login request to backend
        const response = await fetch(BACKEND_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('userEmail', email);
            window.location.href = 'dashboard.html';
        } else {
            showError(data.message || 'Invalid email or password');
        }
    } catch (error) {
        console.error('Login error:', error);
        showError('Network error. Please try again');
    } finally {
        loginBtn.textContent = 'Login';
        loginBtn.disabled = false;
    }
});

function showError(message) {
    errorMessage.textContent = message;
}

function clearError() {
    errorMessage.textContent = '';
}
