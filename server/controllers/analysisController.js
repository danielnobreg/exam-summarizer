const geminiService = require('../services/geminiService');
const { admin, db } = require('../config/firebaseAdmin');

async function executeWithUsageLimit(req, res, next, analysisCallback) {
  try {
    const userId = req.user.uid;

    const userDoc = await db.collection("users").doc(userId).get();
    if (!userDoc.exists) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    const userData = userDoc.data();

    // Administrador passa livremente
    if (userData.isAdmin) {
      const analysis = await analysisCallback();
      return res.json({
        reply: analysis,
        usage: { unlimited: true, canUse: true },
      });
    }

    const dailyLimit = userData.dailyLimit || 5;
    const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Sao_Paulo' }).format(new Date());
    const currentUsage = userData.lastUsageDate === today ? (userData.dailyUsage || 0) : 0;

    if (currentUsage >= dailyLimit) {
      return res.status(403).json({
        error: "Limite diário de análises atingido",
        dailyUsage: currentUsage,
        dailyLimit,
        remaining: 0,
      });
    }

    // Executa a chamada real para a IA
    const analysis = await analysisCallback();

    const newUsage = userData.lastUsageDate === today ? currentUsage + 1 : 1;

    await db.collection("users").doc(userId).update({
      dailyUsage: newUsage,
      lastUsageDate: today,
      lastUsedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return res.json({
      reply: analysis,
      usage: {
        dailyUsage: newUsage,
        dailyLimit,
        remaining: dailyLimit - newUsage,
        canUse: dailyLimit - newUsage > 0,
        unlimited: false,
      },
    });
  } catch (error) {
    next(error);
  }
}

exports.analyzeHemogram = async (req, res, next) => {
  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: "message é obrigatório" });
  }

  await executeWithUsageLimit(req, res, next, async () => {
    return await geminiService.generateAnalysis(message);
  });
};

exports.analyzeXray = async (req, res, next) => {
  const { promptText, images } = req.body;
  
  if (!promptText || !images || !Array.isArray(images) || images.length === 0) {
    return res.status(400).json({ error: "promptText e images (array) são obrigatórios" });
  }

  await executeWithUsageLimit(req, res, next, async () => {
    return await geminiService.generateXrayAnalysis(promptText, images);
  });
};

exports.analyzeECG = async (req, res, next) => {
  const { promptText, images } = req.body;
  
  if (!promptText) {
    return res.status(400).json({ error: "promptText é obrigatório" });
  }

  await executeWithUsageLimit(req, res, next, async () => {
    return await geminiService.generateECGAnalysis(promptText, images);
  });
};
