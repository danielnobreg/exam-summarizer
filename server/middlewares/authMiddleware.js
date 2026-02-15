const { admin, db } = require('../config/firebaseAdmin');

// middleware de autenticação — verifica token Firebase
async function authMiddleware(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const [type, token] = header.split(" ");

    if (type !== "Bearer" || !token) {
      return res.status(401).json({ error: "Token ausente" });
    }

    const decoded = await admin.auth().verifyIdToken(token);

    req.user = {
      uid: decoded.uid,
      email: decoded.email,
    };

    next();
  } catch (err) {
    return res.status(401).json({ error: "Token inválido" });
  }
}

// middleware de autorização — verifica se o usuário é admin no Firestore
async function requireAdmin(req, res, next) {
  try {
    const userId = req.user.uid;
    const userDoc = await db.collection('users').doc(userId).get();

    if (!userDoc.exists || !userDoc.data().isAdmin) {
      return res.status(403).json({ error: "Acesso negado — apenas administradores" });
    }

    next();
  } catch (err) {
    return res.status(500).json({ error: "Erro ao verificar permissão de admin" });
  }
}

module.exports = { authMiddleware, requireAdmin };
