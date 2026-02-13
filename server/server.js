const express = require('express');
const cors = require('cors');
require('dotenv').config();

const analysisRoutes = require('./routes/analysisRoutes');
const adminRoutes = require('./routes/adminRoutes'); 
const usageRoutes = require('./routes/usageRoutes'); 
const errorHandler = require('./middlewares/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.get('/', (req, res) => {
  res.json({ message: 'Hemotrack API está rodando!' });
});

app.use('/api/analysis', analysisRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/usage', usageRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});