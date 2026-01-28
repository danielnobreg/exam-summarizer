const geminiService = require('../services/geminiService');

exports.analyzeHemogram = async (req, res, next) => {
  try {
    const { message } = req.body;
    
    const analysis = await geminiService.generateAnalysis(message);

    res.json({ reply: analysis });
  } catch (error) {
    next(error);
  }
};