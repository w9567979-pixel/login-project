// Get form elements
const signupForm = document.getElementById('signupForm');
const fullNameInput = document.getElementById('fullName');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirmPassword');
const signupBtn = document.getElementById('signupBtn');
const signupMessage = document.getElementById('signupMessage');

// Backend URL
const BACKEND_URL = 'https://login-project-twak.onrender.com/api/signup';

// Handle signup
signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Get values
    const fullName = fullNameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    const confirmPassword = confirmPasswordInput.value.trim();
    
    // Clear previous message
    signupMessage.textContent = '';
    signupMessage.className = '';
    
    // Validation
    if (!fullName || !email || !password || !confirmPassword) {
        showMessage('Please fill in all fields', 'error');
        return;
    }
    
    if (password.length < 6) {
        showMessage('Password must be at least 6 characters', 'error');
        return;
    }
    
    if (password !== confirmPassword) {
        showMessage('Passwords do not match', 'error');
        return;
    }
    
    // Show loading
    signupBtn.textContent = 'Creating account...';
    signupBtn.disabled = true;
    
    try {
        const response = await fetch(BACKEND_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                fullName, 
                email, 
                password 
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // Success!
            showMessage('Account created successfully! 🎉 Redirecting to login...', 'success');
            
            // Redirect to login page after 2 seconds
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
        } else {
            showMessage(data.message || 'Signup failed. Please try again.', 'error');
        }
    } catch (error) {
        console.error('Signup error:', error);
        showMessage('Network error. Please try again.', 'error');
    } finally {
        signupBtn.textContent = 'Create Account';
        signupBtn.disabled = false;
    }
});

function showMessage(message, type) {
    signupMessage.textContent = message;
    signupMessage.className = type;
}