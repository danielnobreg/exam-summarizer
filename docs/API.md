# Documentação da API

## Base URL

- **Desenvolvimento:** `http://localhost:3000`

## Endpoints

### 1. Health Check
```http
GET /
```

**Resposta:**
```json
{
  "message": "Hemotrack API está rodando!"
}
```

---

### 2. Analisar Hemograma
```http
POST /api/analysis/hemogram
```

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "message": "texto extraído do PDF aqui..."
}
```

**Resposta (sucesso):**
```json
{
  "reply": "Lab (11.01.26): Hb 11,3; Ht 32,0%; Leucograma 12940..."
}
```

**Resposta (erro):**
```json
{
  "error": "Mensagem vazia. Envie o texto extraído do PDF."
}
```

**Códigos de Status:**
- `200` - Sucesso
- `400` - Validação falhou
- `500` - Erro no servidor

---

## Exemplo de Uso
```javascript
const response = await fetch('http://localhost:3000/api/analysis/hemogram', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ message: pdfText })
});

const data = await response.json();
console.log(data.reply);
```

## Rate Limiting

- Não implementado ainda
- Considerar adicionar no futuro