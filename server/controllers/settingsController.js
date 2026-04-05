const { db } = require('../config/firebaseAdmin');

exports.getTerms = async (req, res) => {
  try {
    const doc = await db.collection('settings').doc('terms').get();
    if (!doc.exists) {
      // Retorna termos padrão se não existir no banco
      return res.json({
        termsOfUse: '## Termos de Uso\n\nEm breve.',
        privacyPolicy: '## Política de Privacidade\n\nEm breve.',
        updatedAt: null
      });
    }
    res.json(doc.data());
  } catch (error) {
    console.error('Erro ao buscar termos:', error);
    res.status(500).json({ error: 'Erro interno ao buscar termos.' });
  }
};

exports.updateTerms = async (req, res) => {
  try {
    const { termsOfUse, privacyPolicy } = req.body;
    const updatedAt = new Date().toISOString();

    const termsData = {
      termsOfUse,
      privacyPolicy,
      updatedAt
    };

    // Atualiza os termos no Firestore
    await db.collection('settings').doc('terms').set(termsData);

    // Envia e-mail para todos os usuários cadastrados
    const usersSnapshot = await db.collection('users').get();
    
    const batch = db.batch();
    let batchCount = 0;

    usersSnapshot.forEach(doc => {
      const userData = doc.data();
      if (userData.email) {
        const mailRef = db.collection('mail').doc();
        batch.set(mailRef, {
          to: userData.email,
          message: {
            subject: 'Atualização dos Termos de Uso e Política de Privacidade - iXamina',
            html: `
              <div style="font-family: sans-serif; color: #333;">
                <h2>Olá, ${userData.name || 'Doutor(a)'}</h2>
                <p>Gostaríamos de informar que atualizamos nossos <strong>Termos de Uso e Política de Privacidade</strong>.</p>
                <p>Para continuar utilizando o iXamina com segurança e transparência, por favor, acesse o sistema para revisar o novo documento.</p>
                <br/>
                <p>Atenciosamente,</p>
                <p><strong>Equipe iXamina</strong></p>
              </div>
            `
          }
        });
        batchCount++;
      }
    });

    if (batchCount > 0) {
      await batch.commit();
      console.log(`E-mails de atualização agendados para ${batchCount} usuários.`);
    }

    res.json({ success: true, message: 'Termos atualizados e e-mails de notificação agendados.', data: termsData });
  } catch (error) {
    console.error('Erro ao atualizar termos:', error);
    res.status(500).json({ error: 'Erro interno ao atualizar os termos.' });
  }
};
