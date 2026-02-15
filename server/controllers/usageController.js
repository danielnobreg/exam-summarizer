const { admin, db } = require('../config/firebaseAdmin');

// aqui a gente verifica se o usuário ainda tem créditos pra usar hoje
exports.checkUsageLimit = async (req, res, next) => {
  try {
    const userId = req.user.uid;

    // busca os dados do usuário no firestore
    const userDoc = await db.collection('users').doc(userId).get();

    if (!userDoc.exists) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    const userData = userDoc.data();
    const dailyLimit = userData.dailyLimit || 5;
    const today = new Date().toISOString().split('T')[0];

    // se a última vez que usou foi hoje, pega o contador atual, senão reseta pra 0
    const dailyUsage = userData.lastUsageDate === today ? (userData.dailyUsage || 0) : 0;

    // calcula quantos créditos ainda tem disponível
    const remaining = dailyLimit - dailyUsage;
    const canUse = remaining > 0;

    res.json({
      canUse,
      dailyUsage,
      dailyLimit,
      remaining,
      lastUsageDate: userData.lastUsageDate || null
    });

  } catch (error) {
    console.error('Erro ao verificar limite:', error);
    next(error);
  }
};

// aqui a gente registra que o usuário fez uma análise
exports.incrementUsage = async (req, res, next) => {
  try {
    const userId = req.user.uid;

    const userRef = db.collection('users').doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    const userData = userDoc.data();
    const dailyLimit = userData.dailyLimit || 5;
    const today = new Date().toISOString().split('T')[0];

    // se é um novo dia, reseta o contador pra 1, senão incrementa +1
    let newDailyUsage;
    if (userData.lastUsageDate === today) {
      newDailyUsage = (userData.dailyUsage || 0) + 1;
    } else {
      newDailyUsage = 1;
    }

    // verifica se não tá tentando passar do limite
    if (newDailyUsage > dailyLimit) {
      return res.status(403).json({ 
        error: 'Limite diário atingido',
        dailyUsage: userData.dailyUsage,
        dailyLimit
      });
    }

    // atualiza no firestore o contador e a data
    await userRef.update({
      dailyUsage: newDailyUsage,
      lastUsageDate: today,
      lastUsedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    // calcula quantos créditos sobraram
    const remaining = dailyLimit - newDailyUsage;

    res.json({
      success: true,
      dailyUsage: newDailyUsage,
      dailyLimit,
      remaining,
      message: 'Uso registrado com sucesso'
    });

  } catch (error) {
    console.error('Erro ao incrementar uso:', error);
    next(error);
  }
};

// aqui reseta manualmente o contador de um usuário (só admin usa)
// o requireAdmin middleware já garante que só admin chega aqui
exports.resetUsage = async (req, res, next) => {
  try {
    // pega o userId do BODY (o usuário alvo), não do token (que é o admin)
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'userId é obrigatório' });
    }

    const userRef = db.collection('users').doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    
    // reseta tudo pra zero
    await userRef.update({
      dailyUsage: 0,
      lastUsageDate: null
    });

    res.json({
      success: true,
      message: 'Uso resetado com sucesso'
    });

  } catch (error) {
    console.error('Erro ao resetar uso:', error);
    next(error);
  }
};