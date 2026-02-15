import { authFetch } from './authService';

// aqui a gente verifica quantas análises o usuário já fez hoje
export async function checkUsageLimit() {
  const data = await authFetch('/api/usage/check', {
    method: 'POST',
  });
  return data;
}

// aqui registramos que o usuário fez uma análise
export async function incrementUsage() {
  const data = await authFetch('/api/usage/increment', {
    method: 'POST',
  });
  return data;
}

// aqui resetamos o contador (só admin usa)
// recebe o userId do usuário ALVO (não do admin)
export async function resetUsage(userId) {
  const data = await authFetch('/api/usage/reset', {
    method: 'POST',
    body: JSON.stringify({ userId }),
  });
  return data;
}