const express = require('express');
const cors = require('cors');

const app = express();

const PORT = process.env.PORT || 3000;

// CORS
app.use(cors());

// Parse JSON
app.use(express.json());

// Parse URL-encoded data
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/', (req, res) => {
  res.json({
    message: 'QLDA_NHOM10_GODDY Backend is running'
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
