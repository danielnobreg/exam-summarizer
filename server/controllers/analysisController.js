const geminiService = require('../services/geminiService');
const admin = require('firebase-admin');

if (!admin.apps.length) {
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

exports.analyzeHemogram = async (req, res, next) => {
  try {
    const { message } = req.body;
    const userId = req.user.uid;

    if (!message) {
      return res.status(400).json({ error: "message é obrigatório" });
    }

    const userDoc = await db.collection("users").doc(userId).get();

    if (!userDoc.exists) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    const userData = userDoc.data();

    if (userData.isAdmin) {
      const analysis = await geminiService.generateAnalysis(message);
      return res.json({
        reply: analysis,
        usage: { unlimited: true, canUse: true },
      });
    }

    const dailyLimit = userData.dailyLimit || 5;
    const today = new Date().toISOString().split("T")[0];
    const currentUsage =
      userData.lastUsageDate === today ? (userData.dailyUsage || 0) : 0;

    if (currentUsage >= dailyLimit) {
      return res.status(403).json({
        error: "Limite diário de análises atingido",
        dailyUsage: currentUsage,
        dailyLimit,
        remaining: 0,
      });
    }

    const analysis = await geminiService.generateAnalysis(message);

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
};