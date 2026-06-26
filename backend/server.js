const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ IMPROVED CORS CONFIGURATION
app.use(cors({
    origin: '*', // Allows all origins (for testing)
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// OR if you want to allow only your Netlify site:
// app.use(cors({
//     origin: 'https://your-netlify-site.netlify.app',
//     methods: ['GET', 'POST'],
//     allowedHeaders: ['Content-Type']
// }));

app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-here-change-this';

// Sample users
const users = [
    {
        id: 1,
        email: 'demo@example.com',
        password: '$2a$10$XQhV5KXyYoQ4zGzYrE2YHOZ5Xy5Yx5y5Xy5Xy5Xy5Xy5Xy5Xy5' // "password123"
    }
];

// Root route
app.get('/', (req, res) => {
    res.json({ 
        status: 'success',
        message: 'Login API is running!',
        endpoints: {
            login: '/api/login',
            health: '/api/health'
        }
    });
});

// ✅ LOGIN ENDPOINT (make sure this is EXACT)
app.post('/api/login', async (req, res) => {
    console.log('Login attempt:', req.body); // Log for debugging
    
    try {
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
        
        // For demo - accept "password123"
        if (password !== 'password123') {
            return res.status(401).json({ 
                message: 'Invalid email or password' 
            });
        }
        
        const token = jwt.sign(
            { userId: user.id, email: user.email },
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
        
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ 
            message: 'Server error. Please try again later.' 
        });
    }
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Server is running' });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
