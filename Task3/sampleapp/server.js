const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        service: 'mock-service',
        version: '1.0.0'
    });
});

// Readiness probe endpoint
app.get('/ready', (req, res) => {
    res.status(200).json({
        status: 'ready',
        timestamp: new Date().toISOString()
    });
});

// Mock data endpoints
app.get('/api/users', (req, res) => {
    const mockUsers = [
        { id: 1, name: 'John Doe', email: 'john@example.com', role: 'admin' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'user' },
        { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'user' }
    ];
    res.json({
        data: mockUsers,
        total: mockUsers.length,
        timestamp: new Date().toISOString()
    });
});

app.get('/api/products', (req, res) => {
    const mockProducts = [
        { id: 1, name: 'Laptop', price: 999.99, category: 'Electronics' },
        { id: 2, name: 'Book', price: 29.99, category: 'Education' },
        { id: 3, name: 'Coffee Mug', price: 12.99, category: 'Home' }
    ];
    res.json({
        data: mockProducts,
        total: mockProducts.length,
        timestamp: new Date().toISOString()
    });
});

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'Mock Service is running!',
        version: '1.0.0',
        endpoints: [
            'GET /health - Health check',
            'GET /ready - Readiness check',
            'GET /api/users - Get all users',
            'GET /api/products - Get all products'
        ],
        timestamp: new Date().toISOString()
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: 'Something went wrong!',
        timestamp: new Date().toISOString()
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        error: 'Endpoint not found',
        path: req.originalUrl,
        timestamp: new Date().toISOString()
    });
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Mock service listening at http://0.0.0.0:${port}`);
    console.log('Available endpoints:');
    console.log('  GET /health - Health check');
    console.log('  GET /ready - Readiness check');
    console.log('  GET /api/users - Get all users');
    console.log('  GET /api/products - Get all products');
});