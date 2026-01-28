module.exports = (req, res, next) => {
  const { message } = req.body;

  if (!message || message.trim() === '') {
    return res.status(400).json({ 
      error: 'Mensagem vazia. Envie o texto extraído do PDF.' 
    });
  }

  next();
};