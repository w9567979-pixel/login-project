const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS
app.use(cors());
app.use(express.json());

// Secret key
const JWT_SECRET = process.env.JWT_SECRET || 'mysecretkey123';

// Test users (for demo)
const users = [
    {
        id: 1,
        email: 'demo@example.com',
        password: 'password123'
    }
];

// ✅ ROOT ROUTE - This fixes the 404 error!
app.get('/', (req, res) => {
    res.json({
        message: 'Login API is running!',
        endpoints: {
            login: 'POST /api/login',
            health: 'GET /api/health'
        },
        testCredentials: {
            email: 'demo@example.com',
            password: 'password123'
        }
    });
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Server is running' });
});

// Login endpoint
app.post('/api/login', (req, res) => {
    console.log('Login attempt:', req.body);
    
    const { email, password } = req.body;
    
    if (!email || !password) {
        return res.status(400).json({
            message: 'Email and password are required'
        });
    }
    
    const user = users.find(u => u.email === email);
    
    if (!user) {
        return res.status(401).json({
            message: 'Invalid email or password'
        });
    }
    
    if (password !== user.password) {
        return res.status(401).json({
            message: 'Invalid email or password'
        });
    }
    
    const token = jwt.sign(
        { id: user.id, email: user.email },
        JWT_SECRET,
        { expiresIn: '24h' }
    );
    
    res.json({
        message: 'Login successful',
        token: token,
        user: {
            id: user.id,
            email: user.email
        }
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});
