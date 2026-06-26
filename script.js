// Get the form and elements
const loginForm = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const loginBtn = document.getElementById('loginBtn');
const errorMessage = document.getElementById('errorMessage');

// Your Render backend URL (you'll get this after Step 6)
const BACKEND_URL = 'https://login-project-twak.onrender.com';

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
            // Save user info (optional)
            localStorage.setItem('token', data.token);
            localStorage.setItem('userEmail', email);
            
            // Redirect to dashboard
            window.location.href = 'dashboard.html';
        } else {
            // Login failed
            showError(data.message || 'Invalid email or password');
        }
    } catch (error) {
        console.error('Login error:', error);
        showError('Network error. Please try again.');
    } finally {
        // Reset button
        loginBtn.textContent = 'Login';
        loginBtn.disabled = false;
    }
});

// Helper functions
function showError(message) {
    errorMessage.textContent = message;
}

function clearError() {
    errorMessage.textContent = '';
}

// Add enter key support (already handled by form submit)
