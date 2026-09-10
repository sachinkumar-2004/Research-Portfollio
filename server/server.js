require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const apiRoutes = require('./routes');
const { notFoundHandler, errorHandler } = require('./middleware/errorHandler');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to Database
connectDB();

// API Routes
app.use('/api', apiRoutes);

// Root endpoint info
app.get('/', (req, res) => {
  res.json({
    name: 'Academic Portfolio API',
    status: 'online',
    healthCheck: '/api/health'
  });
});

// Error handling middleware
app.use(notFoundHandler);
app.use(errorHandler);

// Server listener
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 [Server]: Server is running on port ${PORT}`);
  console.log(`📡 [Health Check]: http://localhost:${PORT}/api/health`);
});
