const express    = require('express');
const cors       = require('cors');
const fileUpload = require('express-fileupload');
const os         = require('os');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(fileUpload({ useTempFiles: true, tempFileDir: os.tmpdir() }));

app.use('/api/auth',         require('./routes/auth'));
app.use('/api/courses',      require('./routes/courses'));
app.use('/api/videos',       require('./routes/videos'));
app.use('/api/quizzes',      require('./routes/quizzes'));
app.use('/api/certificates', require('./routes/certificates'));

app.get('/health', (req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

process.on('SIGTERM', () => server.close());
process.on('uncaughtException', err => console.error('Uncaught:', err));
process.on('unhandledRejection', err => console.error('Unhandled:', err));
