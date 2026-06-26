const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'mysecretkey123';

// ✅ Users array - NOW WITH FULL NAME!
const users = [
    {
        id: 1,
        fullName: 'Demo User',
        email: 'demo@example.com',
        password: 'password123'
    }
];

// Track next user ID
let nextId = 2;

// Root route
app.get('/', (req, res) => {
    res.json({
        message: 'Login API is running!',
        endpoints: {
            login: 'POST /api/login',
            signup: 'POST /api/signup',
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

// ✅ SIGNUP ENDPOINT - NEW!
app.post('/api/signup', (req, res) => {
    console.log('Signup attempt:', req.body);
    
    const { fullName, email, password } = req.body;
    
    // Validation
    if (!fullName || !email || !password) {
        return res.status(400).json({
            message: 'All fields are required'
        });
    }
    
    if (password.length < 6) {
        return res.status(400).json({
            message: 'Password must be at least 6 characters'
        });
    }
    
    // Check if user already exists
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
        return res.status(400).json({
            message: 'User with this email already exists'
        });
    }
    
    // Create new user
    const newUser = {
        id: nextId++,
        fullName: fullName,
        email: email,
        password: password // In production, hash this!
    };
    
    users.push(newUser);
    console.log('Users after signup:', users);
    
    // Create token for auto-login (optional)
    const token = jwt.sign(
        { id: newUser.id, email: newUser.email },
        JWT_SECRET,
        { expiresIn: '24h' }
    );
    
    res.status(201).json({
        message: 'Account created successfully',
        token: token,
        user: {
            id: newUser.id,
            fullName: newUser.fullName,
            email: newUser.email
        }
    });
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
            fullName: user.fullName,
            email: user.email
        }
    });
});

app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
    console.log(`Users:`, users);
});
