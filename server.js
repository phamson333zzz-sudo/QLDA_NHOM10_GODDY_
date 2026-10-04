const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');

const app = express();

const PORT = process.env.PORT || 3000;

// CORS
app.use(cors());

// Parse JSON
app.use(express.json());

// Parse URL-encoded data
app.use(express.urlencoded({ extended: true }));

// Serve static assets
app.use(express.static('public'));

// Auth routes
app.use('/api/auth', authRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({
    message: 'QLDA_NHOM10_GODDY Backend is running'
  });
});

// Centralized Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);

  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});