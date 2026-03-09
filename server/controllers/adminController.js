const { admin, db } = require('../config/firebaseAdmin');

exports.createUser = async (req, res) => {
  try {
    const { name, email, customPassword } = req.body;
    let { dailyLimit } = req.body;
    
    // quem criou esse usuário foi o admin logado, a gente pega o id dele do token
    const createdBy = req.user.uid;

    // se o admin esqueceu de mandar os dados básicos, barra na hora
    if (!email || !name) {
      return res.status(400).json({ error: 'Preencha todos os campos obrigatórios' });
    }
    dailyLimit = dailyLimit || 20;
    if (dailyLimit > 20) {
      return res.status(400).json({ error: 'O limite diário máximo permitido para novos perfis é 20' });
    }

    // Gera uma senha aleatória extremamente forte e irreversível
    // O usuário não precisa saber essa senha, pois ele próprio setará a dele via "Reset Password"
    const crypto = require('crypto');
    const secureRandomPassword = crypto.randomBytes(32).toString('hex') + "A1@";

    // primeiro cria a conta no Firebase Authentication pra ele poder logar
    const userRecord = await admin.auth().createUser({
      email: email,
      password: secureRandomPassword,
      displayName: name
    });

    // agora cria o perfil dele no Firestore com os limites e quem criou
    await db.collection('users').doc(userRecord.uid).set({
      uid: userRecord.uid,
      name: name,
      email: email,
      isAdmin: false,
      plan: 'basico',
      dailyLimit: dailyLimit || 5,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      createdBy: createdBy
    });

    res.json({ 
      success: true, 
      uid: userRecord.uid,
      message: 'Usuário criado com sucesso'
    });

  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    
    // se o email já existe no Firebase Auth, avisa pra não duplicar
    if (error.code === 'auth/email-already-exists') {
      return res.status(400).json({ error: 'Este email já está cadastrado' });
    }
    
    // erro genérico pra não vazar detalhes pro frontend
    res.status(500).json({ error: 'Erro interno ao criar usuário' });
  }
};

// listar todos os usuários (rota já protegida pro admin)
exports.listUsers = async (req, res) => {
  try {
    // busca TODO mundo da coleção users
    const snapshot = await db.collection('users').get();
    
    // pega a data do Brasil hoje
    const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Sao_Paulo' }).format(new Date());
    
    const users = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      
      // se o cara usou em dias passados, o painel do admin tem que mostrar 0 pra hoje (lazy reset)
      const actualDailyUsage = data.lastUsageDate === today ? (data.dailyUsage || 0) : 0;
      
      // empacota o id do documento junto com os dados reais corrigidos
      users.push({ 
        id: doc.id, 
        ...data,
        dailyUsage: actualDailyUsage // sobrescreve o do banco pelo real de hoje
      });
    });

    // responde com a lista completa
    res.json({ users });
  } catch (error) {
    console.error('Erro ao listar usuários:', error);
    res.status(500).json({ error: 'Erro interno ao listar usuários' });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    
    if (!userId) {
      return res.status(400).json({ error: 'ID do usuário não fornecido.' });
    }

    // 1. Deletar o usuário do Firebase Authentication
    await admin.auth().deleteUser(userId);

    // 2. Deletar o documento do usuário no Firestore (coleção 'users')
    await db.collection('users').doc(userId).delete();

    res.json({ success: true, message: 'Usuário apagado permanentemente do Auth e Firestore.' });
  } catch (error) {
    console.error('Erro ao deletar usuário:', error);
    
    if (error.code === 'auth/user-not-found') {
      // Se não achar no Auth, tenta apagar no Firestore pelo menos para não ficar órfão
      await db.collection('users').doc(req.params.id).delete().catch(console.error);
      return res.json({ success: true, message: 'Usuário não encontrado no Auth, mas dados limpos.' });
    }
    
    res.status(500).json({ error: 'Erro interno ao excluir o usuário.' });
  }
};

exports.getGlobalHistory = async (req, res) => {
  try {
    const usersSnapshot = await db.collection('users').get();
    const allHistory = [];

    // Busca até 20 itens por usuário para evitar sobrecarga
    for (const userDoc of usersSnapshot.docs) {
      const userData = userDoc.data();
      const historySnapshot = await db.collection('users').doc(userDoc.id).collection('history')
        .orderBy('createdAt', 'desc').limit(20).get();

      historySnapshot.forEach(docSnap => {
        allHistory.push({
          id: docSnap.id,
          userId: userDoc.id,
          userEmail: userData.email || 'N/A',
          userName: userData.name || 'N/A',
          ...docSnap.data()
        });
      });
    }

    // Ordenação global por data decrescente
    allHistory.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Retorna os 100 mais recentes
    res.status(200).json({ history: allHistory.slice(0, 100) });
  } catch (error) {
    console.error('Erro ao buscar histórico global:', error);
    res.status(500).json({ error: 'Erro ao buscar histórico global' });
  }
};

exports.undoHistoryItem = async (req, res) => {
  try {
    const { userId, historyId } = req.params;

    const historyRef = db.collection('users').doc(userId).collection('history').doc(historyId);
    const historyDoc = await historyRef.get();

    if (!historyDoc.exists) {
      return res.status(404).json({ error: 'Histórico não encontrado' });
    }

    const historyData = historyDoc.data();
    const createdAtDate = historyData.createdAt ? historyData.createdAt.split('T')[0] : null;

    // Deleta o documento do histórico
    await historyRef.delete();

    // Reembolsa um uso se tiver sido criado hoje
    const userRef = db.collection('users').doc(userId);
    const userDoc = await userRef.get();
    
    let refunded = false;
    
    if (userDoc.exists) {
      const userData = userDoc.data();
      const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Sao_Paulo' }).format(new Date());
      
      // Se usou hoje e dailyUsage > 0, decrementa
      if (userData.lastUsageDate === today && createdAtDate === today && (userData.dailyUsage || 0) > 0) {
        const adminFirebase = require('firebase-admin');
        await userRef.update({
          dailyUsage: adminFirebase.firestore.FieldValue.increment(-1)
        });
        refunded = true;
      }
    }

    res.status(200).json({ success: true, refunded });
  } catch (error) {
    console.error('Erro ao fazer undo do history:', error);
    res.status(500).json({ error: 'Erro ao reverter histórico e reembolsar uso' });
  }
};