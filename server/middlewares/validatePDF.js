module.exports = (req, res, next) => {
  const { message } = req.body;

  if (!message || message.trim() === '') {
    return res.status(400).json({ 
      error: 'Mensagem vazia. Envie o texto extraído do PDF.' 
    });
  }

  // limite de tamanho do texto extraído (50.000 caracteres)
  if (message.length > 50000) {
    return res.status(413).json({
      error: 'Texto do PDF muito grande. Limite: 50.000 caracteres.'
    });
  }

  next();
};