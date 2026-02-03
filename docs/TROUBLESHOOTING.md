# Problemas Comuns

## 1. "Email ou senha incorretos" sempre

**Causa:** Usuário não existe no Firebase Authentication

**Solução:**
1. Vá em Firebase Console → Authentication
2. Verifique se o email existe
3. Se não, crie o usuário

---

## 2. Nome não aparece no Dashboard

**Causa:** Documento no Firestore não existe ou UID errado

**Solução:**
1. Abra console do navegador (F12)
2. Veja se há erros
3. Verifique se o UID do Firestore é igual ao do Authentication
4. Verifique se o campo `name` existe no documento

---

## 3. "CORS error" ao chamar API

**Causa:** Backend não permite requisições do frontend

**Solução:**

No `server/server.js`:
```javascript
app.use(cors({
  origin: ['http://localhost:3000']
}));
```

---

## 4. PDF não é processado

**Causa:** PDF.js não carregou ou PDF está corrompido

**Solução:**
1. Verifique console do navegador
2. Teste com outro PDF
3. Verifique se `loadPdfJs()` foi chamado

---

## 5. Gemini API retorna erro

**Possíveis causas:**
- Chave API inválida
- Cota excedida
- Modelo incorreto

**Solução:**
1. Verifique `GEMINI_API_KEY` no `.env`
2. Veja logs do backend
3. Confirme modelo: `gemini-1.5-flash`

---

## 6. Deploy no Vercel falha

**Checklist:**
- [ ] Root Directory configurado como `client`
- [ ] Todas variáveis de ambiente adicionadas
- [ ] Build passa localmente (`npm run build`)

---

## Precisa de mais ajuda?

Abra uma issue no GitHub ou entre em contato: seu@email.com