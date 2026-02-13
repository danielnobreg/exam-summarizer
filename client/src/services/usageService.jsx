const API_URL = process.env.REACT_APP_API_URL;

// aqui a gente verifica quantas análises o usuário já fez hoje
export async function checkUsageLimit(userId) {
  try {
    const response = await fetch(`${API_URL}/api/usage/check`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId })
    });

    if (!response.ok) {
      throw new Error('Erro ao verificar limite de uso');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro ao verificar limite:', error);
    throw error;
  }
}

// aqui registramos que o usuário fez uma análise (não usamos mais isso pois o backend já incrementa automático)
export async function incrementUsage(userId) {
  try {
    const response = await fetch(`${API_URL}/api/usage/increment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Erro ao registrar uso');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro ao incrementar uso:', error);
    throw error;
  }
}

// aqui resetamos o contador (só admin usa)
export async function resetUsage(userId) {
  try {
    const response = await fetch(`${API_URL}/api/usage/reset`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId })
    });

    if (!response.ok) {
      throw new Error('Erro ao resetar uso');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro ao resetar uso:', error);
    throw error;
  }
}