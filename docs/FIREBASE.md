# Configuração Firebase

## Services Usados

1. **Authentication** - Login/Logout de usuários
2. **Firestore Database** - Armazenamento de dados de usuários

## Regras de Segurança (Firestore)
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow write: if false;
    }
  }
}
```

**Explicação:**
- Usuários só podem ler seus próprios dados
- Ninguém pode escrever pelo frontend (apenas via console ou Admin SDK)

## Cadastrar Novos Usuários

### Via Console
1. **Authentication** → **Users** → **Add user**
2. Copie o UID gerado
3. **Firestore** → Collection `users` → Adicione documento com o UID
4. Campos: `name`, `email`, `isAdmin`

## Custos

Firebase tem plano gratuito generoso:
- Authentication: 10k verificações/mês grátis
- Firestore: 50k leituras/dia grátis