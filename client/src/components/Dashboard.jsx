import React, { useState, useEffect } from "react";
import {
  Activity,
  Syringe,
  HeartPulse,
  History,
  Settings,
  ShieldCheck,
  ChevronRight,
  BrainCircuit,
  Lock,
} from "lucide-react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { getUserData, getUserHistory } from "../services/userService";
import { renderFormattedText } from "../utils/formatters";

const LungsIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M12 2v4" />
    <path d="M12 5v11c0 2-1.5 4-3.5 4C6 20 4 17.5 3.5 14c-.5-3.5 1-7 4-8l4.5-1z" />
    <path d="M12 5v11c0 2 1.5 4 3.5 4C18 20 20 17.5 20.5 14c.5-3.5-1-7-4-8L12 5z" />
  </svg>
);

const Dashboard = ({ user, onNavigate, onLogout }) => {
  const [userData, setUserData] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedResult, setSelectedResult] = useState(null);
  const [copySuccess, setCopySuccess] = useState(false);

  const handleCopy = () => {
    if (selectedResult?.result) {
      navigator.clipboard.writeText(selectedResult.result).then(() => {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      });
    }
  };

  useEffect(() => {
    async function fetchData() {
      if (user?.uid) {
        try {
          const [data, hist] = await Promise.all([
            getUserData(user.uid),
            getUserHistory(user.uid, 5),
          ]);
          setUserData(data);
          setHistory(hist || []);
        } catch (error) {
          console.error("Erro ao buscar dados no dashboard:", error);
        } finally {
          setLoading(false);
        }
      }
    }
    fetchData();
  }, [user]);

  const modules = [
    {
      id: "hemogram",
      icon: <Syringe className="h-6 w-6 text-blue-600" />,
      title: "Laboratorial",
      desc: "Avaliação hematológica",
      color: "blue",
    },
    {
      id: "xray",
      icon: <LungsIcon className="h-6 w-6 text-emerald-600" />,
      title: "Raio-X",
      desc: "Análise Torácica",
      color: "emerald",
    },
    {
      id: "ecg",
      icon: <HeartPulse className="h-6 w-6 text-indigo-600" />,
      title: "ECG",
      desc: "Eletrocardiograma",
      color: "indigo",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0F19] flex flex-col pt-20">
        <Navbar user={user} onNavigate={onNavigate} onLogout={onLogout} />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  const isAdmin = userData?.isAdmin;
  const plan = isAdmin ? "Admin" : userData?.plan || "free";
  const isFree = plan === "free";

  const limitUsed = userData?.usageCount || userData?.dailyUsage || 0;
  const limitTotal = userData?.dailyLimit || 0;
  const percentUsed = limitTotal > 0 ? (limitUsed / limitTotal) * 100 : 0;

  return (
    <div className="min-h-screen bg-[#0B0F19] flex flex-col font-manrope">
      <Navbar user={user} onNavigate={onNavigate} onLogout={onLogout} />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 w-full text-white">
        <div className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-white">
              Olá, {userData?.name ? userData.name.split(" ")[0] : "Doutor"}!
            </h1>
            <p className="text-slate-400 mt-2">
              Bem-vindo ao seu painel de decisão clínica.
            </p>
          </div>
          <div className="flex items-center space-x-3 bg-[#111624] px-4 py-2 rounded-xl shadow-[0_0_15px_rgba(0,0,0,0.5)] border border-white/5">
            <ShieldCheck
              className={`w-5 h-5 ${isAdmin ? "text-purple-400" : "text-emerald-400"}`}
            />
            <span className="text-sm font-semibold text-slate-300">
              Plano:{" "}
              <span
                className={isAdmin ? "text-purple-400" : "text-emerald-400"}
              >
                {isAdmin
                  ? "Admin"
                  : plan === "pro"
                    ? "Pro"
                    : plan === "basico"
                      ? "Básico"
                      : "Free"}
              </span>
            </span>
          </div>
        </div>

        {/* Top Grid: Créditos e Configurações */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          {/* Card de Créditos */}
          <div className="bg-[#111624] rounded-[2rem] p-8 border border-white/5 shadow-2xl col-span-1 lg:col-span-2 flex flex-col justify-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-[80px] -z-10 translate-x-1/3 -translate-y-1/3 pointer-events-none"></div>
            <div className="flex justify-between items-center mb-4 relative z-10">
              <h2 className="text-lg font-bold text-white flex items-center">
                <Activity className="w-5 h-5 text-blue-400 mr-2" />
                Seu Limite Diário
              </h2>
              <span className="text-sm font-semibold text-slate-300 bg-white/5 px-3 py-1 rounded-full border border-white/10">
                {isAdmin
                  ? "∞ Ilimitado"
                  : `${limitUsed} / ${limitTotal} análises`}
              </span>
            </div>

            <div className="w-full bg-[#060913] rounded-full h-3 mb-2 overflow-hidden shadow-inner relative z-10">
              <div
                className={`h-3 rounded-full transition-all duration-1000 ${
                  isAdmin
                    ? "bg-purple-500"
                    : percentUsed >= 90
                      ? "bg-red-500"
                      : percentUsed >= 70
                        ? "bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.6)]"
                        : "bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.6)]"
                }`}
                style={{
                  width: `${isAdmin ? 100 : Math.min(percentUsed, 100)}%`,
                }}
              ></div>
            </div>
            <p className="text-xs text-slate-500 relative z-10">
              {isAdmin
                ? "Conta de administrador não possui limite."
                : "O limite reseta automaticamente à meia-noite (BRT)."}
            </p>
          </div>

          {/* Card de Configurações da IA */}
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2rem] p-8 shadow-[0_10px_40px_rgba(37,99,235,0.15)] text-white flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white opacity-10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
            <div>
              <h2 className="text-lg font-bold mb-2 flex items-center">
                <BrainCircuit className="w-5 h-5 mr-2 opacity-90" />
                Inteligência Customizada
              </h2>
              <p className="text-blue-100 text-sm opacity-90 leading-relaxed">
                Ajuste os parâmetros dos laudos e altere como a IA se comunica
                com você.
              </p>
            </div>
            <button
              onClick={() => onNavigate("settings")}
              className="mt-6 w-full py-2 bg-white/20 hover:bg-white/30 transition-colors rounded-lg text-sm font-semibold flex items-center justify-center backdrop-blur-sm"
            >
              Configurar Prompts
              <Settings className="w-4 h-4 ml-2" />
            </button>
          </div>
        </div>

        {/* Modules Grid */}
        <div className="mb-10">
          <h2 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-2">
            Iniciar Nova Análise
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {modules.map((mod) => (
              <button
                key={mod.id}
                onClick={() => {
                  if (isFree && !isAdmin) {
                    alert(
                      "Acesso restrito. Este módulo requer o Plano Básico ou Pro. Entre em contato para assinar.",
                    );
                  } else {
                    onNavigate(mod.id);
                  }
                }}
                className={`bg-[#111624] rounded-[2rem] p-8 border ${isFree && !isAdmin ? "border-white/5 opacity-60" : "border-white/5 hover:shadow-[0_0_30px_rgba(59,130,246,0.1)] hover:border-blue-500/30"} transition-all duration-300 text-left flex items-start group relative overflow-hidden`}
              >
                {isFree && !isAdmin && (
                  <div className="absolute top-4 right-4 bg-white/5 border border-white/10 p-1.5 rounded-lg text-slate-500">
                    <Lock className="w-4 h-4" />
                  </div>
                )}
                <div
                  className={`p-3 rounded-xl bg-white/5 mr-4 border border-white/5 ${(!isFree || isAdmin) && "group-hover:scale-110 group-hover:bg-white/10"} transition-all`}
                >
                  {mod.icon}
                </div>
                <div className="flex-1 pr-8">
                  <h3 className="font-bold text-white flex items-center">
                    {mod.title}
                  </h3>
                  <p className="text-sm text-slate-400 mt-1">{mod.desc}</p>
                </div>
                {(!isFree || isAdmin) && (
                  <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-blue-400 group-hover:translate-x-1 transition-all mt-3" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* History Section Placeholder */}
        <div>
          <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-2">
            <h2 className="text-xl font-bold text-white flex items-center">
              <History className="w-5 h-5 mr-3 text-blue-500" />
              Histórico Recente
            </h2>
            <span className="text-sm text-slate-400">Últimas 5 análises</span>
          </div>

          {history.length === 0 ? (
            <div className="bg-[#111624] border border-white/5 border-dashed rounded-3xl p-12 text-center">
              <History className="w-12 h-12 text-slate-500 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-white">
                Seu histórico está vazio
              </h3>
              <p className="text-slate-400 text-sm mt-2 max-w-sm mx-auto">
                Realize sua primeira análise para que ela fique gravada aqui de
                forma segura e anônima.
              </p>
            </div>
          ) : (
            <div className="bg-[#111624] border border-white/5 rounded-[2rem] overflow-hidden shadow-2xl">
              <ul className="divide-y divide-white/5">
                {history.map((item) => (
                  <li
                    key={item.id}
                    className="p-6 hover:bg-white/5 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="flex items-start">
                      <div className="p-3 bg-[#060913] border border-white/5 rounded-xl mr-4 flex-shrink-0">
                        {item.type === "hemogram" && (
                          <Syringe className="w-5 h-5 text-blue-500" />
                        )}
                        {item.type === "xray" && (
                          <Activity className="w-5 h-5 text-emerald-500" />
                        )}
                        {item.type === "ecg" && (
                          <HeartPulse className="w-5 h-5 text-indigo-500" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-bold text-white capitalize">
                          {item.type === "hemogram"
                            ? "Hemograma"
                            : item.type === "xray"
                              ? "Raio-X de Tórax"
                              : "Eletrocardiograma"}
                          {item.patientName && (
                            <span className="text-blue-400 ml-2 font-normal text-sm opacity-90">
                              ({item.patientName})
                            </span>
                          )}
                        </h4>
                        <p className="text-sm text-slate-500 mt-1">
                          {new Date(item.createdAt).toLocaleDateString(
                            "pt-BR",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            },
                          )}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedResult(item)}
                      className="text-sm font-semibold text-blue-400 hover:text-white bg-blue-600/10 hover:bg-blue-600/30 px-5 py-2.5 rounded-xl transition-colors border border-blue-500/20 whitespace-nowrap"
                    >
                      Ver Resultado
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </main>

      <Footer />

      {/* Modal Result */}
      {selectedResult && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-[#111624] rounded-3xl shadow-2xl max-w-2xl w-full p-8 max-h-[90vh] flex flex-col border border-white/10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                Log do Exame
              </h2>
              <div className="flex items-center gap-4">
                <button
                  onClick={handleCopy}
                  className="px-4 py-2 text-sm font-medium border border-white/10 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition flex items-center gap-2 z-[9999]"
                >
                  {copySuccess ? (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="text-green-400"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      <span className="text-green-400">Copiado!</span>
                    </>
                  ) : (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <rect
                          x="9"
                          y="9"
                          width="13"
                          height="13"
                          rx="2"
                          ry="2"
                        ></rect>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                      </svg>
                      Copiar Texto
                    </>
                  )}
                </button>
                <button
                  onClick={() => setSelectedResult(null)}
                  className="p-2 hover:bg-white/10 rounded-full text-slate-400 hover:text-white transition cursor-pointer z-[9999]"
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
              </div>
            </div>
            <div className="flex-1 overflow-y-auto bg-[#060913] p-6 rounded-2xl border border-white/5 custom-scrollbar relative">
              <pre className="whitespace-pre-wrap text-sm font-mono text-slate-300 leading-relaxed custom-scrollbar relative z-10 [&_strong]:text-slate-100 [&_strong]:font-bold [&_b]:text-slate-100 [&_b]:font-bold">
                {selectedResult.result
                  ? renderFormattedText(selectedResult.result)
                  : "Nenhum resultado processado salvo neste log antigo."}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
