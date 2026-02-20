const { admin, db } = require('../config/firebaseAdmin');

exports.createUser = async (req, res) => {
  try {
    const { email, password, name, dailyLimit } = req.body;
    
    // quem criou esse usuário foi o admin logado, a gente pega o id dele do token
    const createdBy = req.user.uid;

    // se o admin esqueceu de mandar os dados básicos, barra na hora
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Preencha todos os campos obrigatórios' });
    }

    // segurança mínima da senha
    if (password.length < 6) {
      return res.status(400).json({ error: 'Senha deve ter no mínimo 6 caracteres' });
    }

    // primeiro cria a conta no Firebase Authentication pra ele poder logar
    const userRecord = await admin.auth().createUser({
      email: email,
      password: password,
      displayName: name
    });

    // agora cria o perfil dele no Firestore com os limites e quem criou
    await db.collection('users').doc(userRecord.uid).set({
      uid: userRecord.uid,
      name: name,
      email: email,
      isAdmin: false,
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