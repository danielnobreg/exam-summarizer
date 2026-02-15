import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import * as adminService from '../services/adminService';
import * as usageService from '../services/usageService';
import { ArrowLeft, Users, MessageSquare, RotateCcw } from 'lucide-react';

export default function AdminPanel({ user, onLogout, onNavigate }) {
  const [activeTab, setActiveTab] = useState('users');

  // Construct a user object that satisfies Navbar requirements
  // We assume if they are here, they are admin, so we can mock userData if needed, 
  // or just pass what we have. Navbar checks userData.isAdmin for the link, 
  // but we are already in Admin, so the link is redundant or can check strict equality.
  const navbarUser = { ...user, userData: { isAdmin: true } };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 font-manrope pt-20">
      <Navbar 
        user={navbarUser} 
        onLogout={onLogout} 
        onNavigate={onNavigate} 
      />
      
      {/* Header / Breadcrumb */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => onNavigate('hemogram')}
            className="p-2 bg-white hover:bg-gray-100 rounded-full shadow-sm text-gray-600 transition-all hover:-translate-x-1"
            title="Voltar ao Dashboard"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Painel Administrativo</h1>
            <p className="text-sm text-gray-500">Gerenciamento do sistema Hemotrack</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-1 flex gap-2 mb-8 max-w-md">
          <button
            onClick={() => setActiveTab('users')}
            className={`flex-1 py-2 px-4 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2 ${
              activeTab === 'users'
                ? 'bg-red-600 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Users className="h-4 w-4" />
            Gerenciar Usuários
          </button>
          <button
            onClick={() => setActiveTab('prompts')}
            className={`flex-1 py-2 px-4 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2 ${
              activeTab === 'prompts'
                ? 'bg-red-600 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <MessageSquare className="h-4 w-4" />
            Gerenciar Prompts
          </button>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 md:p-8 animate-fadeIn">
          {activeTab === 'users' && <UsersTab currentUser={user} />}
          {activeTab === 'prompts' && <PromptsTab />}
        </div>
      </div>
    </div>
  );
}

function UsersTab({ currentUser }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    dailyLimit: 5
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [resetingUserId, setResetingUserId] = useState(null);

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    try {
      const usersList = await adminService.listUsers();
      const nonAdminUsers = usersList.filter(u => !u.isAdmin);
      setUsers(nonAdminUsers);
    } catch (err) {
      setError('Erro ao carregar usuários');
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit() {
    setError('');
    setSuccess('');

    try {
      await adminService.createUserProfile(formData);

      setSuccess('Usuário criado com sucesso!');
      setFormData({ name: '', email: '', password: '', dailyLimit: 5 });
      setShowForm(false);
      loadUsers(); 
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleResetUsage(userId, userName) {
    if (!window.confirm(`Tem certeza que deseja resetar o uso de ${userName}?`)) {
      return;
    }

    setResetingUserId(userId);
    try {
      await usageService.resetUsage(userId);
      setSuccess(`Uso de ${userName} resetado com sucesso!`);
      setTimeout(() => setSuccess(''), 3000);
      loadUsers();
    } catch (err) {
      setError('Erro ao resetar uso');
      setTimeout(() => setError(''), 3000);
    } finally {
      setResetingUserId(null);
    }
  }

  return (
    <div className="space-y-8">
      
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <span className="w-2 h-8 bg-red-600 rounded-full"></span>
            Usuários Cadastrados
        </h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className={`px-5 py-2.5 rounded-xl font-bold transition-all shadow-sm ${
              showForm 
              ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
              : 'bg-red-600 text-white hover:bg-red-700 hover:shadow-red-600/20'
          }`}
        >
          {showForm ? 'Cancelar' : '+ Novo Usuário'}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="p-6 bg-gray-50 rounded-2xl border border-gray-200 animate-slideDown">
          <h3 className="text-lg font-bold text-gray-800 mb-6">Cadastrar Novo Usuário</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Nome Completo</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
                placeholder="Ex: Dr. João Silva"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
                placeholder="exemplo@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Senha Inicial</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
                placeholder="Mínimo 6 caracteres"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Limite Diário</label>
              <input
                type="number"
                min="1"
                value={formData.dailyLimit}
                onChange={(e) => setFormData({...formData, dailyLimit: parseInt(e.target.value)})}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
              />
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
               <span className="text-red-500">⚠️</span>
               <p className="text-sm text-red-800 font-medium">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
               <span className="text-green-500">✓</span>
               <p className="text-sm text-green-800 font-medium">{success}</p>
            </div>
          )}

          <button
            onClick={handleSubmit}
            className="w-full bg-red-600 text-white py-3 rounded-xl hover:bg-red-700 transition-all font-bold shadow-lg shadow-red-600/20"
          >
            Criar Usuário
          </button>
        </div>
      )}

      {/* List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-12">
            <div className="w-10 h-10 border-4 border-gray-200 border-t-red-600 rounded-full animate-spin mb-4"></div>
            <p className="text-gray-500 font-medium">Carregando usuários...</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Nome</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Limite</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Uso Hoje</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">{u.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{u.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 font-mono">{u.dailyLimit || 5}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      (u.dailyUsage || 0) >= (u.dailyLimit || 5) 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {u.dailyUsage || 0}/{u.dailyLimit || 5}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-right">
                    <button
                      onClick={() => handleResetUsage(u.id, u.name)}
                      disabled={resetingUserId === u.id}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-bold rounded-lg text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 transition-colors gap-1"
                    >
                      <RotateCcw className="h-3 w-3" />
                      {resetingUserId === u.id ? '...' : 'Resetar'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function PromptsTab() {
  return (
    <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
            <MessageSquare className="h-8 w-8 text-gray-400" />
        </div>
      <h2 className="text-xl font-bold text-gray-800 mb-2">Gerenciar Prompts da IA</h2>
      <p className="text-gray-500 max-w-md mx-auto">Em breve você poderá personalizar as instruções do sistema para análise dos exames.</p>
    </div>
  );
}