const geminiService = require('../services/geminiService');
const { admin, db } = require('../config/firebaseAdmin');

exports.analyzeHemogram = async (req, res, next) => {
  try {
    const { message } = req.body;
    // pega o id do usuário vindo do token, que é seguro
    const userId = req.user.uid;

    // se o front não mandou o texto do exame, a gente barra aqui
    if (!message) {
      return res.status(400).json({ error: "message é obrigatório" });
    }

    // busca as info do usuário lá no banco
    const userDoc = await db.collection("users").doc(userId).get();

    // se o usuário foi deletado do banco por engano ou algo assim, avisa o front
    if (!userDoc.exists) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    const userData = userDoc.data();

    // se ele for admin, libera acesso infinito e nem gasta contagem!
    if (userData.isAdmin) {
      const analysis = await geminiService.generateAnalysis(message);
      return res.json({
        reply: analysis,
        usage: { unlimited: true, canUse: true },
      });
    }

    // pega o limite do cara ou dá 5 análises gratuitas como padrão
    const dailyLimit = userData.dailyLimit || 5;
    
    // pega a data certa no fuso do Brasil, pra evitar o bug de resetar só às 21h
    const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Sao_Paulo' }).format(new Date());
    
    // vê quantas vezes ele já usou hoje, se a data for velha começa do 0 de novo!
    const currentUsage =
      userData.lastUsageDate === today ? (userData.dailyUsage || 0) : 0;

    // se já gastou os créditos do dia, a gente barra ele
    if (currentUsage >= dailyLimit) {
      return res.status(403).json({
        error: "Limite diário de análises atingido",
        dailyUsage: currentUsage,
        dailyLimit,
        remaining: 0,
      });
    }

    // como passou na checagem, a gente pede pra IA resumir o exame
    const analysis = await geminiService.generateAnalysis(message);

    // soma +1 no uso de hoje ou define como 1 se for o primeiro uso
    const newUsage = userData.lastUsageDate === today ? currentUsage + 1 : 1;

    // salva no banco essa alteração pro limite funcionar direito depois
    await db.collection("users").doc(userId).update({
      dailyUsage: newUsage,
      lastUsageDate: today,
      lastUsedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // finalmente manda de volta pro frontend os dados do resumo e quantos créditos sobraram
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
    // se explodir em qualquer etapa passa pro gerenciador de erro geral
    next(error);
  }
};