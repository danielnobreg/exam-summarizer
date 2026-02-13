import React, { useState } from 'react';
import * as authService from '../services/authService';
import TermsModal from './TermsModal';
import Navbar from './Navbar';
import { ArrowRight, Mail, Lock, Eye, EyeOff, CheckSquare, Square } from 'lucide-react';

export default function Login({ onLoginSuccess, onNavigate }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState('terms');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
      setError('Insira o seu email');
      return;
    }

    if (!emailRegex.test(email)) {
      setError('Insira um email válido (e.x. usuário@email.com)');
      return;
    }

    if (!password) {
      setError('Insira a sua senha');
      return;
    }

    if (!acceptedTerms) {
      setError('Você precisa aceitar os Termos de Uso e Políticas de Privacidade');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const user = await authService.login(email, password);
      onLoginSuccess(user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (type) => {
    setModalType(type);
    setModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-manrope flex flex-col">
      <Navbar onNavigate={onNavigate} />
      <div className="flex-1 flex items-center justify-center p-4 pt-20">
        <div className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-md border border-gray-100 relative overflow-hidden">
            {/* Decorative blob */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-50 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2"></div>
            
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center p-4 bg-red-50 rounded-full mb-4 animate-fadeIn">
                <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center shadow-lg shadow-red-600/20">
                    <Lock className="h-5 w-5 text-white" />
                </div>
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Bem-vindo!</h1>
            <p className="text-gray-500 mt-2">Acesse sua conta para continuar</p>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-red-500 transition-colors" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all placeholder-gray-400"
                  placeholder="seu@email.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Senha</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-red-500 transition-colors" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all placeholder-gray-400"
                  placeholder="••••••••"
                  onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition p-1"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100 cursor-pointer" onClick={() => setAcceptedTerms(!acceptedTerms)}>
              <div className={`mt-0.5 transition-colors ${acceptedTerms ? 'text-red-600' : 'text-gray-400'}`}>
                {acceptedTerms ? <CheckSquare className="h-5 w-5" /> : <Square className="h-5 w-5" />}
              </div>
              <label className="text-sm text-gray-600 cursor-pointer select-none">
                Li e aceito os{' '}
                <button 
                  type="button"
                  onClick={(e) => { e.stopPropagation(); openModal('terms'); }}
                  className="text-red-600 hover:text-red-700 font-bold hover:underline"
                >
                  Termos de Uso
                </button>
                {' '}e a{' '}
                <button 
                  type="button"
                  onClick={(e) => { e.stopPropagation(); openModal('privacy'); }}
                  className="text-red-600 hover:text-red-700 font-bold hover:underline"
                >
                  Política de Privacidade
                </button>
              </label>
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl animate-shake">
                <p className="text-sm text-red-800 font-medium flex items-center gap-2">
                    <span className="text-lg">⚠️</span> {error}
                </p>
              </div>
            )}

            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full bg-red-600 text-white py-4 rounded-xl font-bold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-red-600/30 hover:-translate-y-1 flex items-center justify-center gap-2"
            >
              {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Entrando...
                  </>
              ) : (
                  <>
                    Entrar
                    <ArrowRight className="h-5 w-5" />
                  </>
              )}
            </button>
          </div>
        </div>
      </div>

      <TermsModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)}
        type={modalType}
      />
    </div>
  );
}