const { admin, db } = require('../config/firebaseAdmin');

exports.createUser = async (req, res) => {
  try {
    const { email, password, name, dailyLimit } = req.body;
    // createdBy vem do token do admin autenticado (fonte confiável)
    const createdBy = req.user.uid;

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Preencha todos os campos obrigatórios' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Senha deve ter no mínimo 6 caracteres' });
    }

    // Criar no Authentication
    const userRecord = await admin.auth().createUser({
      email: email,
      password: password,
      displayName: name
    });

    // Criar no Firestore
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
    
    if (error.code === 'auth/email-already-exists') {
      return res.status(400).json({ error: 'Este email já está cadastrado' });
    }
    
    res.status(500).json({ error: 'Erro interno ao criar usuário' });
  }
};

// listar todos os usuários (só admin)
exports.listUsers = async (req, res) => {
  try {
    const snapshot = await db.collection('users').get();
    
    const users = [];
    snapshot.forEach((doc) => {
      users.push({ id: doc.id, ...doc.data() });
    });

    res.json({ users });
  } catch (error) {
    console.error('Erro ao listar usuários:', error);
    res.status(500).json({ error: 'Erro interno ao listar usuários' });
  }
};