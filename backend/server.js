const express = require('express');
const cors = require('cors');
const os = require('os');
const path = require('path');
const fs = require('fs');
require('dotenv').config();
const cleanup = require('./utils/cleanup');
const { general } = require('./middleware/rateLimiter');

const app = express();
const PORT = process.env.PORT || 10000;
const origins = (process.env.ALLOWED_ORIGINS || 'https://tools.4sov.com,http://localhost').split(',');

const uploadDir = path.join(os.tmpdir(), 'uploads');
const ytDir = path.join(os.tmpdir(), 'yt');
[uploadDir, ytDir].forEach((d) => fs.mkdirSync(d, { recursive: true }));

app.set('trust proxy', 1); // Render sits behind a proxy
app.use(cors({ origin: origins, methods: ['GET', 'POST', 'OPTIONS'], allowedHeaders: ['Content-Type', 'Authorization'] }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/health', require('./routes/health'));
app.use('/api', general);
app.use('/api/image', require('./routes/image'));
app.use('/api/pdf', require('./routes/pdf'));
app.use('/api/yt', require('./routes/youtube'));

// Upload errors (size, type) come back as clean JSON
app.use((err, req, res, next) => {
  const status = err.code === 'LIMIT_FILE_SIZE' ? 413 : 400;
  res.status(status).json({ error: err.message });
});

setInterval(() => [uploadDir, ytDir].forEach(cleanup), 15 * 60 * 1000);
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
