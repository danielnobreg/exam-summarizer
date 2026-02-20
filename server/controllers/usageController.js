const { admin, db } = require('../config/firebaseAdmin');

// aqui a gente verifica se o usuário ainda tem créditos pra usar hoje
exports.checkUsageLimit = async (req, res, next) => {
  try {
    // pega o id de quem tá chamando pelo token
    const userId = req.user.uid;

    // busca os dados do usuário no firestore
    const userDoc = await db.collection('users').doc(userId).get();

    // se o cara logou mas não tá no banco (vai que foi apagado), avisa
    if (!userDoc.exists) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    const userData = userDoc.data();
    // limite padrão de 5 se não tiver configurado nada
    const dailyLimit = userData.dailyLimit || 5;
    
    // ATENÇÃO: pega a data no fuso de SP! Antes pegava UTC e resetava o limite às 21h do BR
    const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Sao_Paulo' }).format(new Date());

    // se a última vez que usou foi hoje mesmo, pega o contador atual. Se for dia novo, reseta pra 0
    const dailyUsage = userData.lastUsageDate === today ? (userData.dailyUsage || 0) : 0;

    // calcula quantos créditos ainda tem e se pode fazer análise
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
    // o usuário do token é o que fez a análise
    const userId = req.user.uid;

    // tenta pegar o ref do Firestore
    const userRef = db.collection('users').doc(userId);
    const userDoc = await userRef.get();

    // segurança básica: tem que existir no banco
    if (!userDoc.exists) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    // carrega dados de limite
    const userData = userDoc.data();
    const dailyLimit = userData.dailyLimit || 5;
    
    // fuso do Brasil de novo, senão a meia-noite chega mais cedo
    const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Sao_Paulo' }).format(new Date());

    // se é o mesmo dia, incrementa +1; senão, limpa a lousa e começa com 1
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

    // atualiza tudo de vez lá no Firebase
    await userRef.update({
      dailyUsage: newDailyUsage,
      lastUsageDate: today,
      lastUsedAt: admin.firestore.FieldValue.serverTimestamp() // hora server (é independente do nosso today)
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
    
    // apaga os dados de limite pra liberar o uso infinito (até reiniciar a conta amanhã)
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