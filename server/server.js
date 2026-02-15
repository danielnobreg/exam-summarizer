const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const analysisRoutes = require('./routes/analysisRoutes');
const adminRoutes = require('./routes/adminRoutes'); 
const usageRoutes = require('./routes/usageRoutes'); 
const errorHandler = require('./middlewares/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

// segurança — headers HTTP
app.use(helmet());

// CORS — restrito às origens permitidas
const allowedOrigins = [
  'http://localhost:5001',
  'http://localhost:5000',
  process.env.CLIENT_URL
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // permite requests sem origin (mobile apps, Postman dev, etc)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Bloqueado pelo CORS'));
  },
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));

// rate limiting global — 100 requests por minuto por IP
const globalLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 100,
  message: { error: 'Muitas requisições. Tente novamente em 1 minuto.' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(globalLimiter);

// rate limiting específico pra rota de análise (consome tokens do Gemini)
const analysisLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 10,
  message: { error: 'Limite de análises por minuto atingido. Aguarde.' },
  standardHeaders: true,
  legacyHeaders: false,
});

app.get('/', (req, res) => {
  res.json({ message: 'Hemotrack API está rodando!' });
});

app.use('/api/analysis', analysisLimiter, analysisRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/usage', usageRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});