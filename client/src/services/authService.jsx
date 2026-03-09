import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  confirmPasswordReset,
  verifyPasswordResetCode,
} from "firebase/auth";
import { auth } from "../config/firebaseConfig";
import { getUserData } from "./userService";

// const API_URL = process.env.REACT_APP_API_URL;
const API_URL = "http://localhost:5000";

export async function authFetch(path, options = {}) {
  const user = auth.currentUser;
  if (!user) throw new Error("Usuário não autenticado");

  const token = await user.getIdToken(); // token do Firebase

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      ...(options.headers || {}),
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Erro na API");

  return data;
}

export async function login(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password,
    );
    const user = userCredential.user;

    const userData = await getUserData(user.uid);

    return {
      uid: user.uid,
      email: user.email,
      name: userData?.name || "Usuário",
      isAdmin: userData?.isAdmin || false,
    };
  } catch (error) {
    throw new Error(getErrorMessage(error.code));
  }
}

export async function logout() {
  try {
    await signOut(auth);
  } catch (error) {
    throw new Error("Erro ao fazer logout");
  }
}

export async function resetPassword(email) {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    let msg = "Erro ao enviar email de recuperação.";
    if (error.code === "auth/user-not-found") {
      msg = "Nenhum usuário encontrado com este email.";
    } else if (error.code === "auth/invalid-email") {
      msg = "Email inválido.";
    }
    throw new Error(msg);
  }
}

export async function confirmNewPassword(oobCode, newPassword) {
  try {
    await confirmPasswordReset(auth, oobCode, newPassword);
  } catch (error) {
    let msg = "Erro ao redefinir a senha.";
    if (error.code === "auth/expired-action-code") {
      msg =
        "O link de recuperação expirou. Solicite um novo na página de Login.";
    } else if (error.code === "auth/invalid-action-code") {
      msg = "O link de recuperação é inválido ou já foi utilizado.";
    }
    throw new Error(msg);
  }
}

export async function verifyResetCode(oobCode) {
  try {
    const email = await verifyPasswordResetCode(auth, oobCode);
    return email;
  } catch (error) {
    throw new Error("Link inválido ou expirado.");
  }
}

export function getCurrentUser() {
  return auth.currentUser;
}

export function onAuthChange(callback) {
  return onAuthStateChanged(auth, callback);
}

function getErrorMessage(errorCode) {
  const errors = {
    "auth/invalid-email": "Email ou senha incorretos",
    "auth/user-not-found": "Email ou senha incorretos",
    "auth/wrong-password": "Email ou senha incorretos",
    "auth/too-many-requests": "Muitas tentativas. Tente novamente mais tarde",
    "auth/invalid-credential": "Email ou senha incorretos",
  };

  return errors[errorCode] || "Email ou senha incorretos";
}
