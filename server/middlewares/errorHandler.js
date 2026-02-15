module.exports = (err, req, res, next) => {
  console.error('❌ Erro:', err);

  const statusCode = err.statusCode || 500;

  // em produção, não expor detalhes internos do erro
  const message = process.env.NODE_ENV === 'production' && statusCode === 500
    ? 'Erro interno do servidor'
    : err.message || 'Erro interno do servidor';

  res.status(statusCode).json({
    error: message
  });
};