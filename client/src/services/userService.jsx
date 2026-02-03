import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';

export async function getUserData(uid) {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    
    if (userDoc.exists()) {
      return userDoc.data();
    } else {
      return null;
    }
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    throw error;
  }
}

export async function isAdmin(uid) {
  try {
    const userData = await getUserData(uid);
    return userData?.isAdmin || false;
  } catch (error) {
    return false;
  }
}

export async function createUserProfile(uid, data) {
  try {
    await setDoc(doc(db, 'users', uid), {
      name: data.name,
      email: data.email,
      isAdmin: data.isAdmin || false,
      createdAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Erro ao criar perfil:', error);
    throw error;
  }
}