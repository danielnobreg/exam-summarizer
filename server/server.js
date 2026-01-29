const express = require('express'); 
const cors = require('cors');
require('dotenv').config();

const analysisRoutes = require('./routes/analysisRoutes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();
const PORT = process.env.PORT;

app.use(cors({}));
app.use(express.json({ limit: '10mb' }));

app.use('/api/analysis', analysisRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});