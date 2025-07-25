const cors = require('cors');

module.exports = cors({
  origin: ['https://agrotm.com', 'https://app.agrotm.com', 'http://localhost:3000'],
  credentials: true,
});
