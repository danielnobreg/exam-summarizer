# Arquitetura do Projeto

## Estrutura de Pastas
```
hemotrack/
│
├── client/                          Frontend React
│   ├── src/
│   │   ├── components/             Componentes React
│   │   │   ├── Login.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   └── TermsModal.jsx
│   │   ├── services/               Lógica de negócio
│   │   │   ├── authService.js
│   │   │   ├── userService.js
│   │   │   └── analysisService.js
│   │   ├── config/                 Configurações
│   │   │   └── firebaseConfig.js
│   │   └── App.js                  Componente principal
│   └── public/
│       └── index.html
│
└── server/                          Backend Node.js
    ├── controllers/                Controladores
    │   └── analysisController.js
    ├── routes/                     Rotas
    │   └── analysisRoutes.js
    ├── services/                   Serviços externos
    │   └── geminiService.js
    ├── middlewares/                Middlewares
    │   ├── errorHandler.js
    │   └── validatePDF.js
    └── server.js                   Arquivo principal
```

## Fluxo de Autenticação
```
1. Usuário faz login
   ↓
2. Firebase Authentication valida
   ↓
3. authService.login() busca dados no Firestore
   ↓
4. Retorna objeto completo: { uid, email, name, isAdmin }
   ↓
5. App.js armazena em state e redireciona para Dashboard
```

## Fluxo de Análise de PDF
```
1. Usuário faz upload do PDF
   ↓
2. Frontend extrai texto com PDF.js
   ↓
3. Envia texto para API: POST /api/analysis/hemogram
   ↓
4. Backend processa com Google Gemini AI
   ↓
5. Retorna resultado formatado
   ↓
6. Frontend exibe na tela
```

## Banco de Dados (Firestore)

### Collection: `users`
```javascript
users/
└── {uid}
    ├── name: string
    ├── email: string
    └── isAdmin: boolean
```

## Segurança

- Senhas criptografadas pelo Firebase
- Tokens JWT gerenciados automaticamente
- Regras de segurança no Firestore
- CORS configurado no backend
- Validação de entrada nos middlewares