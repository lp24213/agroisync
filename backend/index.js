const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'AGROTM Backend is running' });
});

// Main endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'AGROTM Backend API',
    version: '1.0.0',
    status: 'running',
  });
});

app.listen(PORT, () => {
  console.log(`AGROTM Backend running on port ${PORT}`);
});
