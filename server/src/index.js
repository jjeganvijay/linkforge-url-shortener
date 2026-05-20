const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');
const connectDB = require('./config/db');
const validateEnv = require('./config/validateEnv');
const { port, allowedOrigins, metricsToken } = require('./config/env');

const authRoutes = require('./routes/authRoutes');
const linkRoutes = require('./routes/linkRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const redirectRoutes = require('./routes/redirectRoutes');
const { getPublicStats } = require('./controllers/analyticsController');
const originCheck = require('./middleware/originCheck');
const { csrfProtection } = require('./middleware/csrf');

const app = express();
app.set('trust proxy', 1);

app.use(cookieParser());
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'none'"],
        frameAncestors: ["'none'"],
        baseUri: ["'none'"],
        formAction: ["'none'"],
      },
    },
  })
);
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }
      callback(null, false);
    },
    allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token', 'X-Metrics-Token'],
    exposedHeaders: ['Content-Disposition'],
    credentials: true,
  })
);
app.use(express.json({ limit: '100kb' }));
app.use(express.urlencoded({ extended: true, limit: '100kb' }));

// Helps mitigate CSRF when using cookie-based auth across domains.
app.use(originCheck);
app.use(csrfProtection);

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'URL Shortener API is running',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.round(process.uptime()),
  });
});

app.get('/api/metrics', (req, res) => {
  const isProd = process.env.NODE_ENV === 'production';
  if (isProd) {
    if (!metricsToken) return res.status(404).json({ success: false, message: 'Route not found' });
    if (req.get('x-metrics-token') !== metricsToken) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
  }
  res.json({
    success: true,
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.round(process.uptime()),
    memory: process.memoryUsage(),
    node: process.version,
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/links', linkRoutes);
app.use('/api/analytics', analyticsRoutes);
app.get('/api/public/:shortCode/stats', getPublicStats);
app.use('/', redirectRoutes);

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

async function start() {
  try {
    validateEnv();
    await connectDB();
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err.message);
    process.exit(1);
  }
}

start();
