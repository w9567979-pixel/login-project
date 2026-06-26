// Get the form and elements
const loginForm = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const loginBtn = document.getElementById('loginBtn');
const errorMessage = document.getElementById('errorMessage');

// Backend URL - UPDATE THIS WITH YOUR RENDER URL
const BACKEND_URL = 'https://login-project-twak.onrender.com/api/auth/login';

// Handle form submission
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevent page refresh
    
    // Get values from inputs
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    
    // Simple validation
    if (!email || !password) {
        showError('Please fill in all fields');
        return;
    }
    
    // Show loading state
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
        
        // Parse the response
        const data = await response.json();
        
        if (response.ok) {
            // Login successful!
            // Save user info
            localStorage.setItem('token', data.token);
            localStorage.setItem('userEmail', data.user.email);
            localStorage.setItem('userFullName', data.user.fullName);
            localStorage.setItem('userId', data.user.id);
            localStorage.setItem('userRole', data.user.role || 'user');
            localStorage.setItem('isAdmin', data.user.isAdmin || false);
            
            // Redirect based on role
            if (data.user.isAdmin || data.user.role === 'admin') {
                window.location.href = 'admin-dashboard.html';
            } else {
                window.location.href = 'dashboard.html';
            }
        } else {
            // Login failed - Check if it's a status issue
            if (data.status === 'pending') {
                showError('⏳ Your account is pending admin approval. Please wait.');
            } else if (data.status === 'rejected') {
                showError('❌ Your account was rejected. Please contact support.');
            } else {
                showError(data.message || 'Invalid email or password');
            }
        }
    } catch (error) {
        console.error('Login error:', error);
        showError('Network error. Please try again');
    } finally {
        // Reset button
        loginBtn.textContent = 'Login';
        loginBtn.disabled = false;
    }
});

// Helper functions
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.color = '#e74c3c';
}

function clearError() {
    errorMessage.textContent = '';
}

// Add enter key support (already handled by form submit)

// Optional: Check if user is already logged in
document.addEventListener('DOMContentLoaded', function() {
    const token = localStorage.getItem('token');
    if (token) {
        // User is already logged in, redirect
        const isAdmin = localStorage.getItem('isAdmin') === 'true';
        if (isAdmin) {
            window.location.href = 'admin-dashboard.html';
        } else {
            window.location.href = 'dashboard.html';
        }
    }
});
