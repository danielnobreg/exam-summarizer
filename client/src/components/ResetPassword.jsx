import React, { useState } from "react";
import * as authService from "../services/authService";
import { Lock, Eye, EyeOff, CheckCircle2 } from "lucide-react";

export default function ResetPassword({ oobCode, onNavigateLogin }) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const requirements = [
    { label: "Pelo menos 8 caracteres", met: newPassword.length >= 8 },
    { label: "1 Letra maiúscula", met: /[A-Z]/.test(newPassword) },
    { label: "1 Número", met: /\d/.test(newPassword) },
    { label: "1 Símbolo (!@#$%, etc)", met: /\W/.test(newPassword) },
  ];

  const allReqsMet = requirements.every((r) => r.met);

  const handleReset = async () => {
    setError("");

    // Validação de Senha Forte
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(newPassword);
    const hasNumbers = /\d/.test(newPassword);
    const hasNonalphas = /\W/.test(newPassword);

    if (
      newPassword.length < minLength ||
      !hasUpperCase ||
      !hasNumbers ||
      !hasNonalphas
    ) {
      setError(
        "A senha deve ter no mínimo 8 caracteres, contendo pelo menos 1 letra maiúscula, 1 número e 1 caractere especial (!@#$%).",
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    setLoading(true);

    try {
      // Verifica qual é o e-mail deste oobCode para checar se a senha é igual à antiga
      const email = await authService.verifyResetCode(oobCode);

      try {
        // Tenta logar silenciosamente com a "nova" senha.
        // Se der certo, significa que a senha nova é idêntica à senha atual do banco.
        await authService.login(email, newPassword);

        // Se chegou aqui, logou com sucesso, então a senha proposta é igual à antiga
        await authService.logout(); // desloga pelo teste de colisão
        setLoading(false);
        setError("A nova senha não pode ser idêntica à sua senha atual.");
        return;
      } catch (loginErr) {
        // O erro experado é auth/invalid-credential ou auth/wrong-password
        // Se deu erro de credencial inválida, a senha é realmente nova! Segue o jogo.
      }

      await authService.confirmNewPassword(oobCode, newPassword);
      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] font-manrope flex flex-col text-white">
      <div className="flex-1 flex items-center justify-center p-4">
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
              {success ? "Senha Redefinida!" : "Criar Nova Senha"}
            </h1>
            <p className="text-slate-400 mt-2">
              {success
                ? "Sua conta agora está segura com a nova senha."
                : "Digite a sua nova senha de acesso abaixo."}
            </p>
          </div>

          {success ? (
            <div className="space-y-6 text-center">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center border border-green-500/20 shadow-[0_0_30px_rgba(34,197,94,0.2)]">
                  <CheckCircle2 className="w-10 h-10 text-green-400" />
                </div>
              </div>
              <button
                onClick={onNavigateLogin}
                className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-500 transition-all duration-300 shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:-translate-y-1"
              >
                Ir para o Login
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">
                  Nova Senha
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-blue-400 transition-colors" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full pl-12 pr-12 py-3.5 bg-[#060913]/50 border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none transition-all placeholder-slate-500 text-white"
                    placeholder="Mín. 8 chars, 1 Maiúscula, 1 Num, 1 Símbolo"
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

                {/* Checklist Visual */}
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4">
                  {requirements.map((req, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      {req.met ? (
                        <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-slate-600 flex-shrink-0"></div>
                      )}
                      <span
                        className={`text-xs ${req.met ? "text-green-400 font-medium" : "text-slate-500"}`}
                      >
                        {req.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">
                  Confirmar Nova Senha
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-blue-400 transition-colors" />
                  </div>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-12 pr-12 py-3.5 bg-[#060913]/50 border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none transition-all placeholder-slate-500 text-white"
                    placeholder="Repita a senha"
                    onKeyPress={(e) => e.key === "Enter" && handleReset()}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition p-1"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl animate-shake">
                  <p className="text-sm text-red-400 font-medium flex items-center gap-2">
                    <span className="text-lg">⚠️</span> {error}
                  </p>
                </div>
              )}

              <button
                onClick={handleReset}
                disabled={
                  loading || !allReqsMet || newPassword !== confirmPassword
                }
                className="w-full bg-indigo-600 text-white py-4 vector-btn rounded-xl font-bold hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_30px_rgba(79,70,229,0.5)] hover:-translate-y-1 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Salvando...
                  </>
                ) : (
                  "Salvar Nova Senha"
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
