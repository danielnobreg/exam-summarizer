# Configuração Inicial

## 1. Pré-requisitos

- Node.js 16+ instalado
- Conta no Firebase
- Chave da API do Google Gemini

## 2. Configurar Firebase

1. Acesse [Firebase Console](https://console.firebase.google.com)
2. Crie um novo projeto: `Hemotrack`
3. Ative **Authentication** → Email/Password
4. Ative **Firestore Database**
5. Copie as credenciais do projeto

## 3. Variáveis de Ambiente

### Frontend (`client/.env`)
```env
REACT_APP_API_URL=http://localhost:3000

# Firebase
REACT_APP_FIREBASE_API_KEY=AIza...
REACT_APP_FIREBASE_AUTH_DOMAIN=hemotrack-xxx.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=hemotrack-xxx
REACT_APP_FIREBASE_STORAGE_BUCKET=hemotrack-xxx.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
REACT_APP_FIREBASE_APP_ID=1:123456789:web:abc123
```

### Backend (`server/.env`)
```env
PORT=3000
GEMINI_API_KEY=sua_chave_gemini_aqui
```

## 4. Criar primeiro usuário

Via Firebase Console:
1. **Authentication** → **Users** → **Add user**
2. Email: `admin@hemotrack.com`
3. Senha: `senha123`

No Firestore:
1. **Firestore Database** → **Start collection**
2. Collection ID: `users`
3. Document ID: [copie o UID do Authentication]
4. Fields:
   - `name` (string): `Administrador`
   - `email` (string): `admin@hemotrack.com`
   - `isAdmin` (boolean): `true`

## 5. Rodar aplicação
```bash
# Terminal 1 - Frontend
cd client
npm start

# Terminal 2 - Backend
cd server
npm run dev
```

Acesse: `http://localhost:3000`