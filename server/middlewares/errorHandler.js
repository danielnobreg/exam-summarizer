module.exports = (err, req, res, next) => {
  console.error('❌ Erro:', err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Erro interno do servidor';

  res.status(statusCode).json({
    error: message
  });
};