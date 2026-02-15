const admin = require('firebase-admin');

// inicialização centralizada do Firebase Admin
// todos os controllers e middlewares devem importar daqui
if (!admin.apps.length) {
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

module.exports = { admin, db };
