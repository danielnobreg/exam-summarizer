import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { ArrowLeft, Save, RotateCcw, MessageSquare } from "lucide-react";
import { getCustomPrompt, setCustomPrompt } from "../services/userService";

const EXAM_TYPES = [
  { id: "hemogram", label: "Laboratorial", icon: "🩸" },
  { id: "xray", label: "Raio-X de Tórax", icon: "🩻" },
  { id: "ecg", label: "Eletrocardiograma", icon: "❤️" },
];

export default function Settings({ user, onLogout, onNavigate }) {
  const [activeTab, setActiveTab] = useState("hemogram");
  const [prompts, setPrompts] = useState({ hemogram: "", xray: "", ecg: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    async function fetchPrompts() {
      if (!user?.uid) return;
      try {
        const [hemo, rx, eco] = await Promise.all([
          getCustomPrompt(user.uid, "hemogram"),
          getCustomPrompt(user.uid, "xray"),
          getCustomPrompt(user.uid, "ecg"),
        ]);

        setPrompts({
          hemogram: hemo || "",
          xray: rx || "",
          ecg: eco || "",
        });
      } catch (err) {
        console.error("Erro ao carregar prompts", err);
      } finally {
        setLoading(false);
      }
    }
    fetchPrompts();
  }, [user]);

  const handleSave = async () => {
    setSaving(true);
    setMessage({ type: "", text: "" });
    try {
      await setCustomPrompt(user.uid, activeTab, prompts[activeTab]);
      setMessage({ type: "success", text: "Prompt salvo com sucesso!" });
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    } catch (err) {
      setMessage({ type: "error", text: "Erro ao salvar prompt." });
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    if (
      !window.confirm(
        "Deseja remover suas instruções personalizadas e voltar ao modelo original do sistema?",
      )
    )
      return;
    setSaving(true);
    try {
      await setCustomPrompt(user.uid, activeTab, "");
      setPrompts((prev) => ({
        ...prev,
        [activeTab]: "",
      }));
      setMessage({
        type: "success",
        text: "Customizações removidas. Usando o original da iXamina.",
      });
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    } catch (err) {
      setMessage({ type: "error", text: "Erro ao restaurar prompt." });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] flex flex-col font-manrope text-white">
      <Navbar user={user} onLogout={onLogout} onNavigate={onNavigate} />

      <main className="flex-1 max-w-5xl mx-auto px-4 py-24 w-full">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => onNavigate("dashboard")}
            className="p-2 bg-[#111624] border border-white/10 hover:bg-white/5 rounded-full shadow-[0_0_15px_rgba(0,0,0,0.5)] text-slate-400 hover:text-white transition-all hover:-translate-x-1"
            title="Voltar ao Dashboard"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              <MessageSquare className="w-8 h-8 text-blue-500" />
              Configurar Inteligência
            </h1>
            <p className="text-slate-400 mt-1">
              Ajuste como a Inteligência Artificial deve interpretar e formatar
              os laudos para atender às suas necessidades clínicas.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="bg-[#111624] rounded-2xl shadow-2xl border border-white/5 overflow-hidden flex flex-col md:flex-row min-h-[500px]">
            {/* Sidebar / Tabs */}
            <div className="w-full md:w-64 bg-[#060913] border-r border-white/5 p-4">
              <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 px-3">
                Tipo de Exame
              </h2>
              <div className="space-y-2 flex flex-row md:flex-col overflow-x-auto pb-2 md:pb-0">
                {EXAM_TYPES.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => {
                      setActiveTab(type.id);
                      setMessage({ type: "", text: "" });
                    }}
                    className={`flex-none md:flex-auto w-auto md:w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${
                      activeTab === type.id
                        ? "bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-md"
                        : "text-slate-400 hover:bg-white/5 border border-transparent hover:border-white/10"
                    }`}
                  >
                    <span className="text-lg">{type.icon}</span>
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 p-6 md:p-8 flex flex-col">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  Instruções Customizadas para
                  <span className="text-blue-500">
                    {EXAM_TYPES.find((t) => t.id === activeTab)?.label}
                  </span>
                </h2>
                <p className="text-sm text-slate-400 mt-2 leading-relaxed">
                  Escreva aqui regras e comandos adicionais para a IA incorporar
                  nos laudos desse módulo. Essas regras são exclusivas do seu
                  usuário e se juntarão às instruções rigorosas do sistema.
                  Deixe vazio caso não queira personalizar nada.
                </p>
              </div>

              <div className="flex-1 relative group">
                <textarea
                  className="w-full h-full min-h-[300px] p-4 text-slate-300 font-mono text-sm bg-[#060913]/50 border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 focus:bg-[#060913] transition-all outline-none resize-none custom-scrollbar"
                  placeholder="Ex: 'Sempre faça um resumo em tópicos no final...' ou 'Não forneça interpretações diretas, apenas liste os achados...'"
                  value={prompts[activeTab]}
                  onChange={(e) =>
                    setPrompts((prev) => ({
                      ...prev,
                      [activeTab]: e.target.value,
                    }))
                  }
                />
              </div>

              {/* Status Message */}
              {message.text && (
                <div
                  className={`mt-4 p-4 rounded-xl flex items-center gap-3 ${
                    message.type === "success"
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      : "bg-red-500/10 text-red-400 border border-red-500/20"
                  }`}
                >
                  <span className="font-bold">
                    {message.type === "success" ? "✓" : "⚠️"}
                  </span>
                  <p className="text-sm font-semibold">{message.text}</p>
                </div>
              )}

              {/* Actions */}
              <div className="mt-6 flex flex-col-reverse md:flex-row justify-end gap-4 border-t border-white/5 pt-6">
                <button
                  onClick={handleReset}
                  disabled={saving || !prompts[activeTab]}
                  className="px-6 py-2.5 flex items-center justify-center gap-2 text-sm font-bold text-slate-300 border border-white/10 bg-white/5 rounded-xl hover:bg-white/10 transition-colors disabled:opacity-50"
                >
                  <RotateCcw className="w-4 h-4" />
                  Limpar Regras
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-6 py-2.5 flex items-center justify-center gap-2 text-sm font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-500 shadow-[0_0_20px_rgba(37,99,235,0.3)] transition-all hover:-translate-y-0.5 disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {saving ? "Gravando..." : "Salvar Alterações"}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
