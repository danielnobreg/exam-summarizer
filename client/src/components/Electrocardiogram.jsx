import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import * as analysisService from "../services/analysisService";
import { getUserData } from "../services/userService";
import { useUsageLimit } from "../hooks/useUsageLimit";
import TermsModal from "./TermsModal";
import { LOADING_MESSAGES } from "../services/analysisService";
import { renderFormattedText } from "../utils/formatters";

export default function Electrocardiogram({ user, onLogout, onNavigate }) {
  const [file, setFile] = useState(null);
  const [obs, setObs] = useState("");
  const [showMetadata, setShowMetadata] = useState(false);

  const [loading, setLoading] = useState(false);
  const [apiResponse, setApiResponse] = useState("");
  const [error, setError] = useState("");
  const [copySuccess, setCopySuccess] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [userData, setUserData] = useState(null);

  const [footerModalOpen, setFooterModalOpen] = useState(false);
  const [footerModalType, setFooterModalType] = useState("terms");

  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);

  useEffect(() => {
    analysisService.loadPdfJs();

    if (loading) {
      setLoadingMessageIndex(
        Math.floor(Math.random() * LOADING_MESSAGES.length),
      );
    }
  }, [loading]);

  const {
    canUse,
    dailyLimit,
    remaining,
    loading: usageLoading,
    updateUsageAfterAnalysis,
    refresh: refreshUsage,
  } = useUsageLimit();

  const isAdminUser = !!userData?.isAdmin;
  const canUseEffective = isAdminUser ? true : canUse;

  useEffect(() => {
    async function loadUserData() {
      try {
        const data = await getUserData(user.uid);
        setUserData(data);
      } catch (err) {
        console.error("Erro ao buscar dados do usuário:", err);
      }
    }
    loadUserData();
  }, [user.uid]);

  const fileToBase64 = (fileObj) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(fileObj);
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
    });

  async function handleAnalyze() {
    if (!file) return;
    if (!canUseEffective) {
      setError("Limite diário atingido. Tente novamente amanhã!");
      return;
    }

    setLoading(true);
    setError("");
    setApiResponse("");

    try {
      let promptText = `Observações clínicas: ${obs || "Nenhuma"}`;
      let base64Image = null;

      if (file.type === "application/pdf") {
        const pdfText = await analysisService.extractTextFromPdf(file);
        promptText += `\n\nTEXTO EXTRAÍDO DO PDF DO ECG:\n${pdfText}`;
      } else if (file.type.startsWith("image/")) {
        base64Image = await fileToBase64(file);
      }

      const result = await analysisService.analyzeECG(
        promptText,
        base64Image ? [base64Image] : null,
      );
      setApiResponse(result.reply);

      if (result.usage) {
        updateUsageAfterAnalysis(result.usage);
      }
    } catch (err) {
      if (err.message?.includes("Limite")) {
        setError("Limite diário atingido. Tente novamente amanhã!");
        refreshUsage();
      } else {
        setError(err.message || "Erro ao processar a imagem do ECG");
      }
    } finally {
      setLoading(false);
      setFile(null); // Limpa após análise (opcional, mas bom pra fluxo contínuo)
    }
  }

  const processFile = (selectedFile) => {
    if (
      selectedFile &&
      (selectedFile.type === "application/pdf" ||
        selectedFile.type.startsWith("image/"))
    ) {
      setFile(selectedFile);
      setError("");
      setApiResponse("");
    } else {
      setError("Por favor, selecione um arquivo válido (PDF, JPG, PNG).");
      setFile(null);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(apiResponse).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    });
  };

  const openFooterModal = (type) => {
    setFooterModalType(type);
    setFooterModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-manrope pt-20 flex flex-col">
      <Navbar
        user={{ ...user, userData }}
        onLogout={onLogout}
        onNavigate={onNavigate}
      />

      <div className="flex-1 max-w-4xl mx-auto px-4 py-8 w-full">
        {!isAdminUser && !canUseEffective && !usageLoading && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 animate-pulse">
            <span className="text-2xl">🚫</span>
            <div>
              <p className="text-sm font-bold text-red-800">
                Limite Diário Atingido
              </p>
              <p className="text-xs text-red-700">
                Você já realizou {dailyLimit} análises hoje. Volte amanhã!
              </p>
            </div>
          </div>
        )}

        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-4 bg-white rounded-2xl shadow-sm mb-6 border border-gray-100">
            <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/30 transform rotate-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
              >
                <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
              </svg>
            </div>
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">
            Análise de Eletrocardiograma
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
            Faça o upload do Eletrocardiograma em PDF ou imagem. Informe dados
            clínicos relevantes para uma análise mais precisa.
          </p>
        </div>

        <div className="bg-white rounded-[2rem] shadow-xl p-8 border border-gray-100 relative overflow-hidden">
          <div className="mb-8 bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden transition-all duration-300">
            <button
              onClick={() => setShowMetadata(!showMetadata)}
              className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-100 transition-colors"
            >
              <span className="text-sm font-bold text-gray-700">
                Dados Adicionais do Paciente (Opcional)
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className={`text-gray-500 transition-transform duration-300 ${showMetadata ? "rotate-180" : ""}`}
              >
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>

            <div
              className={`transition-all duration-300 ease-in-out ${showMetadata ? "max-h-96 opacity-100 p-6 pt-2" : "max-h-0 opacity-0 overflow-hidden"}`}
            >
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Observações Clínicas
                </label>
                <textarea
                  value={obs}
                  onChange={(e) => setObs(e.target.value)}
                  placeholder="Queixas relacionadas, uso de marcapasso, histórico de cardiopatias ou arritmias..."
                  className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none h-24"
                />
              </div>
            </div>
          </div>

          <div className="mb-8">
            <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">
              Arquivo PDF ou Imagem do ECG (Apenas 1)
            </label>
            <label
              htmlFor="file-upload"
              className={`group flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-300 ${
                isDragging
                  ? "border-indigo-400 bg-indigo-50 scale-[1.02]"
                  : "border-gray-200 bg-gray-50/50 hover:bg-white hover:border-indigo-300 hover:shadow-md"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div
                className={`transition-transform duration-300 ${isDragging ? "scale-110" : "group-hover:scale-110"}`}
              >
                <div
                  className={`w-14 h-14 rounded-full flex items-center justify-center mb-3 transition-colors ${isDragging ? "bg-indigo-100" : "bg-white shadow-sm group-hover:bg-indigo-50"}`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    className={`transition-colors ${isDragging ? "text-indigo-600" : "text-gray-400 group-hover:text-indigo-500"}`}
                  >
                    <rect
                      x="3"
                      y="3"
                      width="18"
                      height="18"
                      rx="2"
                      ry="2"
                    ></rect>
                    <circle cx="8.5" cy="8.5" r="1.5"></circle>
                    <polyline points="21 15 16 10 5 21"></polyline>
                  </svg>
                </div>
              </div>
              <p className="text-sm text-gray-700 mb-1 font-medium">
                {file ? (
                  <span className="text-gray-500 font-bold">
                    Máximo de arquivos anexado
                  </span>
                ) : (
                  <>
                    <span className="text-indigo-600 font-bold border-b border-indigo-200 hover:border-indigo-600 transition-colors">
                      Clique para enviar
                    </span>{" "}
                    ou arraste o arquivo
                  </>
                )}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Suporta PDF, JPG e PNG
              </p>
              <input
                id="file-upload"
                type="file"
                className="hidden"
                accept="application/pdf,image/*"
                onChange={handleFileChange}
                disabled={!!file}
              />
            </label>
          </div>

          {/* Estado de Arquivo Selecionado */}
          {file && (
            <div className="mb-6 flex items-center justify-between p-4 bg-green-50 border border-green-100 rounded-xl animate-fadeIn">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white rounded-lg shadow-sm">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-green-600"
                  >
                    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-bold text-green-900">
                    {file.name}
                  </p>
                  <p className="text-xs text-green-700">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <button
                onClick={() => setFile(null)}
                className="text-green-700 hover:text-green-900 p-2 hover:bg-green-100 rounded-full transition flex-shrink-0"
                title="Remover arquivo"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
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
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-center animate-shake">
              <p className="text-sm text-red-800 font-bold flex items-center justify-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                {error}
              </p>
            </div>
          )}

          <button
            onClick={handleAnalyze}
            disabled={!file || loading || !canUseEffective}
            className="w-full bg-indigo-600 text-white font-bold py-4 px-6 rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-indigo-600/30 hover:-translate-y-1 flex items-center justify-center gap-3 text-lg relative overflow-hidden group"
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Analisando...
              </>
            ) : !canUseEffective ? (
              <>Limites Esgotados</>
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M4.5 3h15" />
                  <path d="M6 3v16a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V3" />
                  <path d="M6 14h12" />
                </svg>
                Analisar Eletrocardiograma
              </>
            )}
          </button>

          {/* Resultados */}
          {(apiResponse || loading) && (
            <div className="mt-10 pt-8 border-t border-gray-100 animate-fadeIn">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600 text-sm font-black">
                    AI
                  </span>
                  Laudo Eletrocardiográfico
                </h2>
                {apiResponse && (
                  <button
                    onClick={handleCopy}
                    className="px-4 py-2 text-sm font-medium border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600 hover:text-gray-900 transition flex items-center gap-2"
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
                          className="text-green-600"
                        >
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                        <span className="text-green-600">Copiado!</span>
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
                )}
              </div>
              <div className="bg-gray-50/80 rounded-2xl p-6 border border-gray-200 min-h-[150px] shadow-inner relative flex flex-col justify-center">
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-10 text-gray-500 space-y-4">
                    <p className="animate-pulse font-medium text-indigo-600">
                      Processando ondas e ritmo cardíaco...
                    </p>
                    <p className="text-xs text-gray-400 text-center max-w-md animate-fadeIn opacity-80 h-8 transition-opacity duration-500">
                      {LOADING_MESSAGES[loadingMessageIndex]}
                    </p>
                  </div>
                ) : (
                  <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 leading-relaxed custom-scrollbar relative z-10">
                    {renderFormattedText(apiResponse)}
                  </pre>
                )}
              </div>
            </div>
          )}
        </div>

        {!isAdminUser && (
          <div className="text-center mt-8 mb-6">
            {usageLoading ? (
              <p className="text-sm text-gray-400">Calculando uso...</p>
            ) : (
              <div className="inline-flex items-center gap-3 bg-white px-5 py-3 rounded-2xl shadow-sm border border-gray-100">
                <div
                  className={`w-2 h-2 rounded-full ${remaining === 0 ? "bg-red-500" : "bg-green-500"} animate-pulse`}
                ></div>
                <p className="text-sm font-medium text-gray-600">
                  Análises hoje:{" "}
                  <span className="font-bold text-gray-900">{remaining}</span>{" "}
                  de <span className="text-gray-500">{dailyLimit}</span>
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      <footer className="mt-auto py-6 border-t border-gray-200 bg-white">
        <div className="max-w-4xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-500">
            © 2026 Sintesys. Todos os direitos reservados.
          </p>
          <div className="flex gap-4">
            <button
              onClick={() => openFooterModal("terms")}
              className="text-xs text-gray-500 hover:text-indigo-600 transition"
            >
              Termos de Uso
            </button>
            <button
              onClick={() => openFooterModal("privacy")}
              className="text-xs text-gray-500 hover:text-indigo-600 transition"
            >
              Privacidade
            </button>
          </div>
        </div>
      </footer>

      <TermsModal
        isOpen={footerModalOpen}
        onClose={() => setFooterModalOpen(false)}
        type={footerModalType}
      />
    </div>
  );
}
