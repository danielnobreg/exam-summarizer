import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import {
  ArrowLeft,
  Save,
  RotateCcw,
  MessageSquare,
} from "lucide-react";
import { getCustomPrompt, setCustomPrompt, getSystemPrompt } from "../services/userService";

const EXAM_TYPES = [
  { id: "hemogram", label: "Laboratorial", icon: "🩸" },
  { id: "xray", label: "Raio-X de Tórax", icon: "🩻" },
  { id: "ecg", label: "Eletrocardiograma", icon: "❤️" },
];

export default function Settings({ user, onLogout, onNavigate }) {
  const [activeTab, setActiveTab] = useState("hemogram");
  const [prompts, setPrompts] = useState({ hemogram: "", xray: "", ecg: "" });
  const [systemPrompts, setSystemPrompts] = useState({ hemogram: '', xray: '', ecg: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    async function fetchPrompts() {
      if (!user?.uid) return;
      try {
        const [hemo, rx, eco] = await Promise.all([
          getCustomPrompt(user.uid, 'hemogram'),
          getCustomPrompt(user.uid, 'xray'),
          getCustomPrompt(user.uid, 'ecg')
        ]);
        const [sysHemo, sysRx, sysEco] = await Promise.all([
          getSystemPrompt('hemogram'),
          getSystemPrompt('xray'),
          getSystemPrompt('ecg')
        ]);

        setSystemPrompts({
          hemogram: sysHemo || "Instrução do Hemograma",
          xray: sysRx || "Instrução do Raio-X",
          ecg: sysEco || "Instrução do ECG"
        });

        setPrompts({
          hemogram: hemo || sysHemo || "Instruções do Hemograma",
          xray: rx || sysRx || "Instruções do Raio-X",
          ecg: eco || sysEco || "Instruções do ECG"
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
        "Deseja restaurar as instruções originais da Sintesys para este exame?",
      )
    )
      return;
    setSaving(true);
    try {
      await setCustomPrompt(user.uid, activeTab, "");
      setPrompts((prev) => ({ ...prev, [activeTab]: systemPrompts[activeTab] }));
      setMessage({
        type: "success",
        text: "Prompt restaurado para o original da Sintesys.",
      });
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    } catch (err) {
      setMessage({ type: "error", text: "Erro ao restaurar prompt." });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-manrope">
      <Navbar user={user} onLogout={onLogout} onNavigate={onNavigate} />

      <main className="flex-1 max-w-5xl mx-auto px-4 py-24 w-full">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => onNavigate("dashboard")}
            className="p-2 bg-white border border-slate-200 hover:bg-slate-100 rounded-full shadow-sm text-slate-600 transition-all hover:-translate-x-1"
            title="Voltar ao Dashboard"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
              <MessageSquare className="w-8 h-8 text-blue-600" />
              Configurar Inteligência
            </h1>
            <p className="text-slate-500 mt-1">
              Ajuste como a Inteligência Artificial deve interpretar e formatar
              os laudos para atender às suas necessidades clínicas.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden flex flex-col md:flex-row min-h-[500px]">
            {/* Sidebar / Tabs */}
            <div className="w-full md:w-64 bg-slate-50 border-r border-slate-200 p-4">
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 px-3">
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
                        ? "bg-blue-600 text-white shadow-md"
                        : "text-slate-600 hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-200"
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
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  Instruções Customizadas para
                  <span className="text-blue-600">
                    {EXAM_TYPES.find((t) => t.id === activeTab)?.label}
                  </span>
                </h2>
                <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                  Escreva aqui como você quer que o laudo saia. Seja claro e
                  inclua um modelo ou estrutura se necessário. Deixe este campo
                  em branco se quiser usar a configuração estruturada original
                  da Sintesys.
                </p>
              </div>

              <div className="flex-1 relative group">
                <textarea
                  className="w-full h-full min-h-[300px] p-4 text-slate-700 font-mono text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all outline-none resize-none custom-scrollbar"
                  placeholder="Carregando instrução..."
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
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : "bg-red-50 text-red-700 border border-red-200"
                  }`}
                >
                  <span className="font-bold">
                    {message.type === "success" ? "✓" : "⚠️"}
                  </span>
                  <p className="text-sm font-semibold">{message.text}</p>
                </div>
              )}

              {/* Actions */}
              <div className="mt-6 flex flex-col-reverse md:flex-row justify-end gap-4 border-t border-slate-100 pt-6">
                <button
                  onClick={handleReset}
                  disabled={saving || prompts[activeTab] === systemPrompts[activeTab]}
                  className="px-6 py-2.5 flex items-center justify-center gap-2 text-sm font-bold text-slate-600 border border-slate-200 bg-white rounded-xl hover:bg-slate-50 transition-colors disabled:opacity-50"
                >
                  <RotateCcw className="w-4 h-4" />
                  Restaurar Original
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-6 py-2.5 flex items-center justify-center gap-2 text-sm font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 shadow-md shadow-blue-600/20 transition-all hover:-translate-y-0.5 disabled:opacity-50"
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
