import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import * as adminService from "../services/adminService";
import * as usageService from "../services/usageService";
import * as authService from "../services/authService";
import { getSystemPrompt, updateSystemPrompt } from "../services/userService";
import {
  ArrowLeft,
  Users,
  MessageSquare,
  Save,
  AlertCircle,
} from "lucide-react";

function getInitials(name) {
  if (!name) return "";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function AdminPanel({ user, onLogout, onNavigate }) {
  const [activeTab, setActiveTab] = useState("users");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Constrói um objeto de usuário que satisfaz os requisitos do Navbar
  // Assumimos que se eles estão aqui, são administradores, então podemos mockar userData se necessário,
  // ou apenas passar o que temos. O Navbar verifica userData.isAdmin para o link,
  // mas já estamos no Admin, então o link é redundante ou pode verificar igualdade estrita.
  const navbarUser = { ...user, userData: { isAdmin: true } };

  return (
    <div
      className={`min-h-screen bg-[#0B0F19] text-white font-manrope ${!isModalOpen ? "pt-20" : ""}`}
    >
      {!isModalOpen && (
        <Navbar user={navbarUser} onLogout={onLogout} onNavigate={onNavigate} />
      )}

      {/* Header / Breadcrumb */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => onNavigate("hemogram")}
            className="p-2 bg-[#111624] border border-white/10 hover:bg-white/5 rounded-full shadow-[0_0_15px_rgba(0,0,0,0.5)] text-slate-400 hover:text-white transition-all hover:-translate-x-1"
            title="Voltar ao Dashboard"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              Painel Administrativo
            </h1>
            <p className="text-sm text-slate-400">
              Gerenciamento do sistema iXamina
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-[#060913] rounded-xl shadow-sm border border-white/5 p-1 flex gap-2 mb-8 max-w-md">
          <button
            onClick={() => setActiveTab("users")}
            className={`flex-1 py-2 px-4 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2 ${
              activeTab === "users"
                ? "bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-md"
                : "text-slate-400 hover:bg-white/5 border border-transparent hover:border-white/10"
            }`}
          >
            <Users className="h-4 w-4" />
            Gerenciar Usuários
          </button>
          <button
            onClick={() => setActiveTab("prompts")}
            className={`flex-1 py-2 px-4 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2 ${
              activeTab === "prompts"
                ? "bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-md"
                : "text-slate-400 hover:bg-white/5 border border-transparent hover:border-white/10"
            }`}
          >
            <MessageSquare className="h-4 w-4" />
            Gerenciar Prompts
          </button>
        </div>

        {/* Content */}
        <div className="bg-[#111624] rounded-2xl shadow-2xl border border-white/5 p-6 md:p-8 animate-fadeIn">
          {activeTab === "users" && (
            <UsersTab currentUser={user} onModalChange={setIsModalOpen} />
          )}
          {activeTab === "prompts" && <PromptsTab />}
        </div>
      </div>
    </div>
  );
}

function UsersTab({ currentUser, onModalChange }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  // Estado para o modal de detalhes do usuário
  const [selectedUser, setSelectedUser] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    dailyLimit: 5,
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  // Controla a Navbar e o scroll da página quando abrir o modal
  useEffect(() => {
    const isModalOpen = selectedUser !== null;

    if (onModalChange) {
      onModalChange(isModalOpen);
    }

    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    // Cleanup caso o componente desmonte
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [selectedUser, onModalChange]);

  async function loadUsers() {
    try {
      const usersList = await adminService.listUsers();
      const nonAdminUsers = usersList.filter((u) => !u.isAdmin);
      setUsers(nonAdminUsers);
    } catch (err) {
      setError("Erro ao carregar usuários");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit() {
    setError("");
    setSuccess("");

    if (!formData.name || !formData.email) {
      setError("Preencha todos os campos obrigatórios.");
      return;
    }

    if (formData.dailyLimit > 10) {
      setError(
        "O limite diário não pode exceder 10 análises para garantir o desempenho.",
      );
      return;
    }

    try {
      await adminService.createUserProfile(formData);

      setSuccess(
        "Usuário adicionado! Um link para criar a senha foi enviado para o email dele.",
      );
      setFormData({ name: "", email: "", dailyLimit: 5 });
      setShowForm(false);
      loadUsers();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleResetUsage(userId, userName) {
    if (
      !window.confirm(`Tem certeza que deseja resetar o uso de ${userName}?`)
    ) {
      return;
    }

    setActionLoading(true);
    try {
      await usageService.resetUsage(userId);
      setSuccess(`Uso de ${userName} resetado com sucesso!`);
      setTimeout(() => setSuccess(""), 3000);
      loadUsers();
      if (selectedUser && selectedUser.id === userId) {
        setSelectedUser({ ...selectedUser, dailyUsage: 0 });
      }
    } catch (err) {
      setError("Erro ao resetar uso");
      setTimeout(() => setError(""), 3000);
    } finally {
      setActionLoading(false);
    }
  }

  async function handleEditLimit(userId, currentLimit) {
    const newLimit = window.prompt(
      "Digite o novo limite diário:",
      currentLimit,
    );
    if (newLimit === null || newLimit === "") return;

    // Converter para número
    const parsedLimit = parseInt(newLimit, 10);
    if (isNaN(parsedLimit) || parsedLimit < 1) {
      window.alert("Limite inválido.");
      return;
    }

    if (parsedLimit > 10) {
      window.alert("O limite diário não pode exceder 10 análises.");
      return;
    }

    setActionLoading(true);
    try {
      // Simulando a chamada pois ainda não temos updateLimit no adminService
      // await adminService.updateUserLimit(userId, parsedLimit);
      setSuccess(`O limite foi atualizado. (Nota: Rota de backend pendente)`);
      setTimeout(() => setSuccess(""), 3000);

      // Atualização otimista da interface
      setUsers(
        users.map((u) =>
          u.id === userId ? { ...u, dailyLimit: parsedLimit } : u,
        ),
      );
      if (selectedUser && selectedUser.id === userId) {
        setSelectedUser({ ...selectedUser, dailyLimit: parsedLimit });
      }
    } catch (err) {
      setError("Erro ao atualizar limite");
      setTimeout(() => setError(""), 3000);
    } finally {
      setActionLoading(false);
    }
  }

  async function handleDeleteUser(userId, userName) {
    if (
      !window.confirm(
        `AVISO CRÍTICO: Tem certeza absoluta que deseja apagar o usuário ${userName}? Esta ação não pode ser desfeita.`,
      )
    ) {
      return;
    }

    setActionLoading(true);
    try {
      await adminService.deleteUser(userId);
      setSuccess(`Usuário apagado com sucesso do sistema e banco de dados.`);
      setTimeout(() => setSuccess(""), 3000);

      // Atualização da interface
      setUsers(users.filter((u) => u.id !== userId));
      setSelectedUser(null);
    } catch (err) {
      setError(err.message || "Erro ao deletar usuário");
      setTimeout(() => setError(""), 3000);
    } finally {
      setActionLoading(false);
    }
  }

  async function handleSendResetEmail(email) {
    if (
      !window.confirm(
        `Deseja enviar um link de redefinição de senha para ${email}?`,
      )
    ) {
      return;
    }
    setActionLoading(true);
    try {
      await authService.resetPassword(email);
      setSuccess(`Link de redefinição enviado com sucesso para ${email}!`);
      setTimeout(() => setSuccess(""), 4000);
    } catch (err) {
      setError(err.message || "Erro ao enviar e-mail de redefinição");
      setTimeout(() => setError(""), 4000);
    } finally {
      setActionLoading(false);
    }
  }

  return (
    <div className="space-y-8 relative">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <span className="w-2 h-8 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.6)]"></span>
          Usuários Cadastrados
        </h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className={`px-5 py-2.5 rounded-xl font-bold transition-all shadow-sm ${
            showForm
              ? "bg-white/10 text-white hover:bg-white/20 border border-white/5"
              : "bg-blue-600 text-white hover:bg-blue-500 hover:shadow-[0_0_20px_rgba(37,99,235,0.3)]"
          }`}
        >
          {showForm ? "Cancelar" : "+ Novo Usuário"}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="p-6 bg-[#060913] rounded-2xl border border-white/5 animate-slideDown">
          <h3 className="text-lg font-bold text-white mb-6">
            Cadastrar Novo Usuário
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                Nome Completo
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-4 py-3 bg-[#111624] border border-white/10 text-white rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none transition-all placeholder-slate-500"
                placeholder="Ex: Dr. João Silva"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-4 py-3 bg-[#111624] border border-white/10 text-white rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none transition-all placeholder-slate-500"
                placeholder="exemplo@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                Limite Diário (Máx 10)
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={formData.dailyLimit}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    dailyLimit: parseInt(e.target.value),
                  })
                }
                className="w-full px-4 py-3 bg-[#111624] border border-white/10 text-white rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none transition-all placeholder-slate-500"
              />
            </div>
          </div>

          <div className="flex items-start gap-3 mb-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-blue-400 mt-0.5" />
            <p className="text-sm font-medium text-blue-300">
              Ao adicionar o usuário, ele receberá um e-mail com instruções para
              criar a sua própria senha com segurança, sem que você precise
              saber qual é.
            </p>
          </div>

          {error && !selectedUser && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
              <span className="text-red-500">⚠️</span>
              <p className="text-sm text-red-800 font-medium">{error}</p>
            </div>
          )}

          {success && !selectedUser && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
              <span className="text-green-500">✓</span>
              <p className="text-sm text-green-800 font-medium">{success}</p>
            </div>
          )}

          <button
            onClick={handleSubmit}
            className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition-all font-bold shadow-lg shadow-blue-600/20"
          >
            Criar Usuário
          </button>
        </div>
      )}

      {/* Tabela Simplificada */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="w-10 h-10 border-4 border-white/10 border-t-blue-500 rounded-full animate-spin mb-4"></div>
          <p className="text-slate-400 font-medium">Carregando usuários...</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-white/5">
          <table className="w-full text-left">
            <thead className="bg-[#060913]">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Perfis (Clique para gerenciar)
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {users.length === 0 ? (
                <tr>
                  <td className="px-6 py-4 text-sm text-slate-500 text-center">
                    Nenhum usuário cadastrado.
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr
                    key={u.id}
                    className="hover:bg-white/5 transition-colors cursor-pointer"
                    onClick={() => setSelectedUser(u)}
                  >
                    <td className="px-6 py-4 text-sm font-semibold text-white hover:text-blue-400 transition-colors flex items-center">
                      <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs font-bold mr-3 uppercase border border-blue-500/30">
                        {getInitials(u.name)}
                      </div>
                      {u.name}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Mensagens Globais do Modal */}
      {error && selectedUser && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
          <span className="text-red-500">⚠️</span>
          <p className="text-sm text-red-800 font-medium">{error}</p>
        </div>
      )}

      {success && selectedUser && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
          <span className="text-green-500">✓</span>
          <p className="text-sm text-green-800 font-medium">{success}</p>
        </div>
      )}

      {/* Modal Profile / Detalhes */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex justify-center items-center z-50 p-4">
          <div className="bg-[#111624] border border-white/5 rounded-3xl shadow-2xl w-full max-w-lg p-8 animate-scaleUp relative overflow-hidden">
            <button
              onClick={() => setSelectedUser(null)}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>

            <div className="flex items-center mb-8">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center text-xl font-bold mr-4 shadow-[0_0_20px_rgba(59,130,246,0.5)] border border-white/10 uppercase">
                {getInitials(selectedUser.name)}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {selectedUser.name}
                </h2>
                <p className="text-sm text-slate-400">{selectedUser.email}</p>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <div className="bg-[#060913] p-4 rounded-xl border border-white/5 flex justify-between items-center">
                <div className="text-sm text-slate-400">Limite Diário</div>
                <div className="flex gap-4 items-center">
                  <div className="font-bold text-white">
                    {selectedUser.dailyLimit || 5}
                  </div>
                  <button
                    onClick={() =>
                      handleEditLimit(
                        selectedUser.id,
                        selectedUser.dailyLimit || 5,
                      )
                    }
                    disabled={actionLoading}
                    className="text-xs font-bold text-blue-400 hover:text-white uppercase p-1 underline disabled:opacity-50"
                  >
                    Editar Limite
                  </button>
                </div>
              </div>

              <div className="bg-[#060913] p-4 rounded-xl border border-white/5 flex justify-between items-center">
                <div className="text-sm text-slate-400">Uso no Dia Atual</div>
                <div className="flex gap-4 items-center">
                  <span
                    className={`inline-flex px-2 py-1 rounded text-xs font-bold border ${
                      (selectedUser.dailyUsage || 0) >=
                      (selectedUser.dailyLimit || 5)
                        ? "bg-red-500/10 text-red-400 border-red-500/20"
                        : "bg-green-500/10 text-green-400 border-green-500/20"
                    }`}
                  >
                    {selectedUser.dailyUsage || 0}/
                    {selectedUser.dailyLimit || 5}
                  </span>
                  <button
                    onClick={() =>
                      handleResetUsage(selectedUser.id, selectedUser.name)
                    }
                    disabled={actionLoading}
                    className="text-xs font-bold text-slate-400 hover:text-white uppercase p-1"
                  >
                    Resetar Uso
                  </button>
                </div>
              </div>

              <div className="bg-[#060913] p-4 rounded-xl border border-white/5 flex justify-between items-center">
                <div className="text-sm text-slate-400">Último Acesso</div>
                <div className="font-medium text-white text-sm">
                  {selectedUser.lastUsageDate ? (
                    <>Data: {selectedUser.lastUsageDate}</>
                  ) : (
                    <span className="text-slate-500">Nunca utilizou</span>
                  )}
                </div>
              </div>
            </div>

            <div className="border-t border-white/10 pt-6 flex justify-between gap-4">
              <button
                onClick={() => handleSendResetEmail(selectedUser.email)}
                disabled={actionLoading}
                className="px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 hover:bg-indigo-500 hover:text-white font-bold rounded-lg transition-colors text-sm disabled:opacity-50 text-center"
              >
                Enviar Reset de Senha
              </button>
              <button
                onClick={() =>
                  handleDeleteUser(selectedUser.id, selectedUser.name)
                }
                disabled={actionLoading}
                className="px-4 py-2 bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white font-bold rounded-lg transition-colors text-sm disabled:opacity-50 text-center"
              >
                Apagar Perfil Definitivamente
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function PromptsTab() {
  const [activeTab, setActiveTab] = useState("hemogram");
  const [prompts, setPrompts] = useState({ hemogram: "", xray: "", ecg: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const EXAM_TYPES = [
    { id: "hemogram", label: "Hemograma" },
    { id: "xray", label: "Raio-X" },
    { id: "ecg", label: "ECG" },
  ];

  useEffect(() => {
    async function loadPrompts() {
      try {
        const [hemo, rx, ecg] = await Promise.all([
          getSystemPrompt("hemogram"),
          getSystemPrompt("xray"),
          getSystemPrompt("ecg"),
        ]);
        setPrompts({
          hemogram: hemo || "Você é um assistente...",
          xray: rx || "Você é um assistente...",
          ecg: ecg || "Você é um clínico...",
        });
      } catch (err) {
        console.error("Erro", err);
      } finally {
        setLoading(false);
      }
    }
    loadPrompts();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setMessage({ type: "", text: "" });
    try {
      await updateSystemPrompt(activeTab, prompts[activeTab]);
      setMessage({
        type: "success",
        text: "Instrução base atualizada (afetará todos os usuários s/ prompt customizado).",
      });
      setTimeout(() => setMessage({ type: "", text: "" }), 4000);
    } catch (e) {
      setMessage({ type: "error", text: "Erro ao salvar." });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-12 text-center text-gray-500">
        Carregando prompts base...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <MessageSquare className="h-6 w-6 text-blue-500" />
        <h2 className="text-xl font-bold text-white">
          Gerenciar Instruções Base (Global)
        </h2>
      </div>

      <div className="flex gap-2 bg-[#060913] border border-white/5 p-1 rounded-xl w-max">
        {EXAM_TYPES.map((type) => (
          <button
            key={type.id}
            onClick={() => setActiveTab(type.id)}
            className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${
              activeTab === type.id
                ? "bg-blue-600/20 text-blue-400 shadow border border-blue-500/30"
                : "text-slate-400 hover:text-white hover:bg-white/5 border border-transparent"
            }`}
          >
            {type.label}
          </button>
        ))}
      </div>

      <div className="bg-[#060913] p-4 border border-white/5 rounded-xl">
        <div className="flex items-start gap-3 mb-4 text-amber-400 bg-amber-500/10 p-3 rounded-lg border border-amber-500/20">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <p className="text-sm font-medium">
            Atenção: A instrução aqui definida será usada como o{" "}
            <b className="text-white">modelo padrão</b> para todos os usuários
            que não tiverem uma instrução customizada configurada em seus perfis
            para este exame.
          </p>
        </div>

        <textarea
          className="w-full h-80 p-4 font-mono text-sm text-slate-300 bg-[#111624] border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none resize-y custom-scrollbar"
          value={prompts[activeTab]}
          onChange={(e) =>
            setPrompts({ ...prompts, [activeTab]: e.target.value })
          }
        />

        {message.text && (
          <div
            className={`mt-4 p-3 rounded-lg font-bold text-sm border ${message.type === "success" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-red-500/10 text-red-400 border-red-500/20"}`}
          >
            {message.text}
          </div>
        )}

        <div className="mt-4 flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:bg-blue-500 transition disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? "Salvando..." : "Salvar Instrução Global"}
          </button>
        </div>
      </div>
    </div>
  );
}
