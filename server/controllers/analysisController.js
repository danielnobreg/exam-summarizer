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

function sanitizePII(text) {
  if (!text) return text;
  let sanitized = text;

  // Mask CPFs
  sanitized = sanitized.replace(/\b\d{3}\.\d{3}\.\d{3}-\d{2}\b/g, "[CPF REMOVIDO]");
  
  // Mask RGs (loose brazilian format)
  sanitized = sanitized.replace(/\b\d{1,2}\.\d{3}\.\d{3}-[0-9X]\b/ig, "[RG REMOVIDO]");

  // Mask Emails
  sanitized = sanitized.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, "[EMAIL REMOVIDO]");

  // Mask Patient Names (Heuristic: Look for "Paciente:", "Nome:")
  // Matches "Paciente: Nome Completo da Silva " until newline or specific characters
  sanitized = sanitized.replace(/(Nome|Paciente|Patient)[\s:]*([A-Za-zÀ-ÖØ-öø-ÿ\s]+)(?=\n|\r|,|-|RG|CPF|Idade|$)/ig, "$1: [DADO SENSÍVEL REMOVIDO] ");

  return sanitized;
}

async function getCustomInstruction(userId, examType) {
  try {
    const docRef = db.collection('users').doc(userId).collection('custom_prompts').doc(examType);
    const docSnap = await docRef.get();
    if (docSnap.exists && docSnap.data().prompt) {
       return docSnap.data().prompt;
    }
  } catch(e) {
    console.warn("Erro ao buscar custom prompt:", e);
  }
  return null;
}

async function getSystemInstruction(examType) {
  try {
    const docRef = db.collection('system').doc('prompts');
    const docSnap = await docRef.get();
    if (docSnap.exists && docSnap.data()[examType]) {
       return docSnap.data()[examType];
    }
  } catch(e) {
    console.warn("Erro ao buscar system prompt:", e);
  }
  return null;
}

exports.analyzeHemogram = async (req, res, next) => {
  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: "message é obrigatório" });
  }

  await executeWithUsageLimit(req, res, next, async () => {
    const redactedMessage = sanitizePII(message);
    const customInstruction = await getCustomInstruction(req.user.uid, 'hemogram');
    const systemInstruction = await getSystemInstruction('hemogram');
    return await geminiService.generateAnalysis(redactedMessage, customInstruction || systemInstruction);
  });
};

exports.analyzeXray = async (req, res, next) => {
  const { promptText, images } = req.body;
  
  if (!promptText || !images || !Array.isArray(images) || images.length === 0) {
    return res.status(400).json({ error: "promptText e images (array) são obrigatórios" });
  }

  await executeWithUsageLimit(req, res, next, async () => {
    const redactedMessage = sanitizePII(promptText);
    const customInstruction = await getCustomInstruction(req.user.uid, 'xray');
    const systemInstruction = await getSystemInstruction('xray');
    return await geminiService.generateXrayAnalysis(redactedMessage, images, customInstruction || systemInstruction);
  });
};

exports.analyzeECG = async (req, res, next) => {
  const { promptText, images } = req.body;
  
  if (!promptText) {
    return res.status(400).json({ error: "promptText é obrigatório" });
  }

  await executeWithUsageLimit(req, res, next, async () => {
    const redactedMessage = sanitizePII(promptText);
    const customInstruction = await getCustomInstruction(req.user.uid, 'ecg');
    const systemInstruction = await getSystemInstruction('ecg');
    return await geminiService.generateECGAnalysis(redactedMessage, images, customInstruction || systemInstruction);
  });
};
