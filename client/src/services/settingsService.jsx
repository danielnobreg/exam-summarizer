import { auth } from '../config/firebaseConfig';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

const getHeaders = async () => {
  const user = auth.currentUser;
  if (!user) return { 'Content-Type': 'application/json' };
  const token = await user.getIdToken();
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

export async function getTerms() {
  const response = await fetch(`${API_URL}/settings/terms`);
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || 'Erro ao buscar termos');
  }
  return response.json();
}

export async function updateTerms(termsData) {
  const headers = await getHeaders();
  const response = await fetch(`${API_URL}/settings/terms`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(termsData)
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || 'Erro ao atualizar termos');
  }
  return response.json();
}
