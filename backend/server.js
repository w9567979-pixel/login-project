const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Secret key (in production, use environment variable)
const JWT_SECRET = 'your-secret-key-here-change-this';

// Sample user database (in production, use real database)
const users = [
    {
        id: 1,
        email: 'demo@example.com',
        password: '$2a$10$XQhV5KXyYoQ4zGzYrE2YHOZ5Xy5Yx5y5Xy5Xy5Xy5Xy5Xy5Xy5' // "password123"
    }
];

// Login endpoint
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Check if email and password are provided
        if (!email || !password) {
            return res.status(400).json({ 
                message: 'Email and password are required' 
            });
        }
        
        // Find user (in production, query database)
        const user = users.find(u => u.email === email);
        
        if (!user) {
            return res.status(401).json({ 
                message: 'Invalid email or password' 
            });
        }
        
        // Check password (in production, use bcrypt.compare)
        // For demo, accept "password123" as valid
        if (password !== 'password123') {
            return res.status(401).json({ 
                message: 'Invalid email or password' 
            });
        }
        
        // Create JWT token
        const token = jwt.sign(
            { userId: user.id, email: user.email },
            JWT_SECRET,
            { expiresIn: '24h' }
        );
        
        // Send success response
        res.json({
            message: 'Login successful',
            token: token,
            user: {
                id: user.id,
                email: user.email
            }
        });
        
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ 
            message: 'Server error. Please try again later.' 
        });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Server is running' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});