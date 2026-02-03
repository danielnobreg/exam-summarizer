# Deploy da Aplicação

## Frontend (Vercel)

1. Conecte repositório no Vercel
2. Configure:
   - **Root Directory:** `client`
   - **Framework:** Create React App
3. Adicione variáveis de ambiente (todas do Firebase)
4. Deploy!

**URL:** `https://hemotrack.vercel.app`

## Backend (Render)

1. Conecte repositório no Render
2. Configure:
   - **Root Directory:** `server`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
3. Adicione variáveis:
   - `GEMINI_API_KEY`
   - `PORT` (deixe em branco, Render define automaticamente)
4. Deploy!

**URL:** `https://hemotrack-api.onrender.com`

## Atualizar URL da API

Após deploy do backend, atualize no frontend:

**`client/.env`:**
```env
REACT_APP_API_URL=https://hemotrack-api.onrender.com
```

Commit e push → Vercel faz redeploy automático.

## Checklist de Deploy

- [ ] Variáveis de ambiente configuradas
- [ ] Firebase em modo produção
- [ ] API rodando e acessível
- [ ] Frontend conectado à API correta
- [ ] Testar login
- [ ] Testar análise de PDF
- [ ] Verificar logs de erro