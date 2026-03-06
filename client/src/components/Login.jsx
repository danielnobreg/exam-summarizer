import React, { useState, useRef } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import * as authService from "../services/authService";
import TermsModal from "./TermsModal";
import {
  ArrowRight,
  Mail,
  Lock,
  Eye,
  EyeOff,
  CheckSquare,
  Square,
} from "lucide-react";

export default function Login({ onLoginSuccess, onNavigate }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState("terms");
  const [showPassword, setShowPassword] = useState(false);
  const [captchaValue, setCaptchaValue] = useState(null);

  const recaptchaRef = useRef(null);
  const RECAPTCHA_SITE_KEY = process.env.REACT_APP_RECAPTCHA_SITE_KEY;

  const handleLogin = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
      setError("Insira o seu email");
      return;
    }

    if (!emailRegex.test(email)) {
      setError("Insira um email válido (e.x. usuário@email.com)");
      return;
    }

    if (!password) {
      setError("Insira a sua senha");
      return;
    }

    if (!acceptedTerms) {
      setError(
        "Você precisa aceitar os Termos de Uso e Políticas de Privacidade",
      );
      return;
    }

    if (!captchaValue) {
      setError("Por favor, confirme que você não é um robô (reCAPTCHA).");
      return;
    }

    setLoading(true);
    setError("");

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
    <div className="min-h-screen bg-[#0B0F19] font-manrope flex flex-col text-white">
      <div className="flex-1 flex items-center justify-center p-4 pt-20">
        <div className="bg-[#111624] rounded-[2.5rem] shadow-2xl p-8 md:p-10 w-full max-w-md border border-white/5 relative overflow-hidden">
          {/* Decorative blob */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] -z-10 translate-x-1/3 -translate-y-1/3 pointer-events-none"></div>

          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center p-4 bg-white/5 rounded-2xl mb-6 relative">
              <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full"></div>
              <div className="relative z-10 w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25 border border-white/10">
                <Lock className="h-6 w-6 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              Bem-vindo!
            </h1>
            <p className="text-slate-400 mt-2">
              Acesse sua conta para continuar
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-300 mb-2">
                Email
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400 group-focus-within:text-blue-400 transition-colors" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-[#060913]/50 border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none transition-all placeholder-slate-500 text-white"
                  placeholder="seu@email.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-300 mb-2">
                Senha
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-blue-400 transition-colors" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-3.5 bg-[#060913]/50 border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none transition-all placeholder-slate-500 text-white"
                  placeholder="••••••••"
                  onKeyPress={(e) => e.key === "Enter" && handleLogin()}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition p-1"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <div
              className="flex items-start gap-4 p-4 bg-white/5 rounded-xl border border-white/5 cursor-pointer hover:bg-white/10 transition-colors"
              onClick={() => setAcceptedTerms(!acceptedTerms)}
            >
              <div
                className={`mt-0.5 transition-colors ${acceptedTerms ? "text-blue-400" : "text-slate-500"}`}
              >
                {acceptedTerms ? (
                  <CheckSquare className="h-5 w-5" />
                ) : (
                  <Square className="h-5 w-5" />
                )}
              </div>
              <label className="text-sm text-slate-300 cursor-pointer select-none leading-relaxed">
                Li e aceito os{" "}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    openModal("terms");
                  }}
                  className="text-blue-400 hover:text-blue-300 font-bold hover:underline transition-colors"
                >
                  Termos de Uso
                </button>{" "}
                e a{" "}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    openModal("privacy");
                  }}
                  className="text-blue-400 hover:text-blue-300 font-bold hover:underline transition-colors"
                >
                  Política de Privacidade
                </button>
              </label>
            </div>

            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl animate-shake">
                <p className="text-sm text-red-400 font-medium flex items-center gap-2">
                  <span className="text-lg">⚠️</span> {error}
                </p>
              </div>
            )}

            <div className="flex justify-center my-4">
              <ReCAPTCHA
                ref={recaptchaRef}
                sitekey={RECAPTCHA_SITE_KEY}
                onChange={(val) => setCaptchaValue(val)}
              />
            </div>

            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-4 vector-btn rounded-xl font-bold hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_30px_rgba(79,70,229,0.5)] hover:-translate-y-1 flex items-center justify-center gap-2"
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
