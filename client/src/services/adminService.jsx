import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';

// const API_URL = process.env.REACT_APP_API_URL;
const API_URL = 'http://localhost:5000';
export async function createUserProfile(userData) {
  try {
    const response = await fetch(`${API_URL}/api/admin/create-user`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Erro ao criar usuário');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    throw error;
  }
}

// LISTAR USUÁRIOS
export async function listUsers() {
  try {
    const usersRef = collection(db, 'users');
    const querySnapshot = await getDocs(usersRef);
    
    const users = [];
    querySnapshot.forEach((doc) => {
      users.push({ id: doc.id, ...doc.data() });
    });
    
    return users;
  } catch (error) {
    console.error('Erro ao listar usuários:', error);
    throw error;
  }
}