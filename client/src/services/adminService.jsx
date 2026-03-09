import { authFetch } from "./authService";

// CRIAR USUÁRIO — via backend (protegido com authMiddleware + requireAdmin)
export async function createUserProfile(userData) {
  const data = await authFetch("/api/admin/create-user", {
    method: "POST",
    body: JSON.stringify(userData),
  });
  return data;
}

// LISTAR USUÁRIOS — via backend (protegido com authMiddleware + requireAdmin)
export async function listUsers() {
  const data = await authFetch("/api/admin/list-users", {
    method: "GET",
  });
  return data.users;
}

// APAGAR USUÁRIO — via backend (apaga do Auth e do Firestore)
export async function deleteUser(userId) {
  const data = await authFetch(`/api/admin/delete-user/${userId}`, {
    method: "DELETE",
  });
  return data;
}

export async function getGlobalHistory() {
  const data = await authFetch("/api/admin/global-history", {
    method: "GET",
  });
  return data.history;
}

export async function undoHistoryItem(userId, historyId) {
  const data = await authFetch(
    `/api/admin/global-history/${userId}/${historyId}`,
    {
      method: "DELETE",
    },
  );
  return data;
}
