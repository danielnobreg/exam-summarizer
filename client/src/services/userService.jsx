import {
  doc,
  getDoc,
  setDoc,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  limit,
} from "firebase/firestore";
import { db } from "../config/firebaseConfig";

export async function getUserData(uid) {
  try {
    const userDoc = await getDoc(doc(db, "users", uid));

    if (userDoc.exists()) {
      return userDoc.data();
    } else {
      return null;
    }
  } catch (error) {
    console.error("Erro ao buscar usuário:", error);
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
    await setDoc(doc(db, "users", uid), {
      name: data.name,
      email: data.email,
      isAdmin: false,
      plan: "basico",
      createdAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Erro ao criar perfil:", error);
    throw error;
  }
}

export async function addHistoryEntry(uid, entryData) {
  try {
    const historyRef = collection(db, "users", uid, "history");
    await addDoc(historyRef, {
      ...entryData,
      createdAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Erro ao salvar no histórico:", error);
    throw error;
  }
}

export async function getUserHistory(uid, maxItems = 10) {
  try {
    const historyRef = collection(db, "users", uid, "history");
    const q = query(historyRef, orderBy("createdAt", "desc"), limit(maxItems));
    const querySnapshot = await getDocs(q);

    const history = [];
    querySnapshot.forEach((docSnap) => {
      history.push({ id: docSnap.id, ...docSnap.data() });
    });

    return history;
  } catch (error) {
    console.error("Erro ao buscar histórico:", error);
    return [];
  }
}

export async function getCustomPrompt(uid, examType) {
  try {
    const docRef = doc(db, "users", uid, "custom_prompts", examType);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists() && docSnap.data().prompt) {
      return docSnap.data().prompt;
    }
  } catch (error) {
    console.error("Erro ao buscar prompt customizado:", error);
  }
  return "";
}

export async function getSystemPrompt(examType) {
  try {
    const docRef = doc(db, "system", "prompts");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists() && docSnap.data()[examType]) {
      return docSnap.data()[examType];
    }
  } catch (error) {
    console.error("Erro ao buscar prompt master:", error);
  }
  return "";
}

export async function updateSystemPrompt(examType, promptText) {
  try {
    const docRef = doc(db, "system", "prompts");
    await setDoc(docRef, { [examType]: promptText }, { merge: true });
  } catch (error) {
    console.error("Erro ao salvar prompt master:", error);
    throw error;
  }
}

export async function setCustomPrompt(uid, examType, promptText) {
  try {
    const docRef = doc(db, "users", uid, "custom_prompts", examType);
    await setDoc(docRef, { prompt: promptText });
  } catch (error) {
    console.error("Erro ao salvar prompt customizado:", error);
    throw error;
  }
}
