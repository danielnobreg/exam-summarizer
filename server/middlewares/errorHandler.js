module.exports = (err, req, res, next) => {
  console.error('❌ Erro:', err);

  const statusCode = err.statusCode || 500;

  // em produção, não expor detalhes internos do erro
  const message = process.env.NODE_ENV === 'production' && statusCode === 500
    ? 'Erro interno do servidor'
    : err.message || 'Erro interno do servidor';

  let finalMessage = message;

  // Tratamento específico para erros da inteligência artificial (Gemini)
  if (err.message && (err.message.includes('503 Service Unavailable') || err.message.includes('High demand'))) {
    finalMessage = 'O serviço de Inteligência Artificial está sob alta demanda no momento. Por favor, tente novamente em alguns instantes.';
  }

  res.status(statusCode).json({
    error: finalMessage
  });
};