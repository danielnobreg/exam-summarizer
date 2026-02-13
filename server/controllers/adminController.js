const admin = require('firebase-admin');

if (!admin.apps.length) {
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

exports.createUser = async (req, res) => {
  try {
    const { email, password, name, dailyLimit, createdBy } = req.body;

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
    
    res.status(500).json({ error: error.message });
  }
};